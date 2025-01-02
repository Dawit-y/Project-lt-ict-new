import React, { useEffect, memo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import axios from "axios";
import Spinners from "../../components/Common/Spinner";

const API_URL = "https://pms.awashsol.com/api";

const fetchTasks = async (projectPlanId) => {
  const { data } = await axios.get(
    `${API_URL}/data?project_plan_id=${projectPlanId}`
  );
  return data;
};

const createTask = async (newTask) => {
  const { description, ...rest } = newTask;
  const payload = {
    ...rest,
    notes: description,
  };
  const { data } = await axios.post(`${API_URL}/task`, payload);
  return data;
};

const updateTask = async (updatedTask) => {
  const { description, ...rest } = updatedTask;
  const payload = {
    ...rest,
    notes: description,
  };
  const { data } = await axios.put(
    `${API_URL}/task/${updatedTask.id}`,
    payload
  );
  return data;
};

const deleteTask = async (taskId) => {
  const { data } = await axios.delete(`${API_URL}/task/${taskId}`);
  return data;
};

const createLink = async (newLink) => {
  const { data } = await axios.post(`${API_URL}/link`, newLink);
  return data;
};

const updateLink = async (updatedLink) => {
  const { data } = await axios.put(
    `${API_URL}/link/${updatedLink.id}`,
    updatedLink
  );
  return data;
};

const deleteLink = async (linkId) => {
  const { data } = await axios.delete(`${API_URL}/link/${linkId}`);
  return data;
};

const isValidDate = (dateString) => {
  return (
    dateString &&
    dateString !== "0000-00-00 00:00:00" &&
    !isNaN(new Date(dateString).getTime())
  );
};

const GanttChart = ({ pld_id }) => {
  const queryClient = useQueryClient();
  const ganttInitialized = useRef(false);
  const processorInitialized = useRef(false);

  const {
    data = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", pld_id],
    queryFn: () => fetchTasks(pld_id),
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries(["tasks", pld_id]),
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => queryClient.invalidateQueries(["tasks", pld_id]),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries(["tasks", pld_id]),
  });

  const createLinkMutation = useMutation({
    mutationFn: createLink,
    onSuccess: () => queryClient.invalidateQueries(["tasks", pld_id]),
  });

  const updateLinkMutation = useMutation({
    mutationFn: updateLink,
    onSuccess: () => queryClient.invalidateQueries(["tasks", pld_id]),
  });

  const deleteLinkMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => queryClient.invalidateQueries(["tasks", pld_id]),
  });

  useEffect(() => {
    const ganttContainer = document.getElementById("gantt_here");
    if (!ganttInitialized.current && ganttContainer) {
      gantt.init("gantt_here");

      gantt.config.lightbox.sections = [
        {
          name: "text",
          height: 40,
          map_to: "text",
          type: "textarea",
          focus: true,
        },
        {
          name: "priority",
          height: 22,
          map_to: "priority",
          type: "select",
          options: [
            { key: "Low", label: "Low" },
            { key: "Medium", label: "Medium" },
            { key: "High", label: "High" },
          ],
        },
        { name: "notes", height: 70, map_to: "description", type: "textarea" },
        { name: "time", type: "duration", map_to: "auto" },
      ];

      gantt.locale.labels.section_text = "Task Name";
      gantt.locale.labels.section_priority = "Priority";
      gantt.locale.labels.section_notes = "Description";

      if (!processorInitialized.current) {
        gantt.createDataProcessor(async (type, action, item, id) => {
          let mutation;
          if (type === "task") {
            if (action === "create") {
              mutation = createMutation.mutateAsync({
                ...item,
                project_plan_id: pld_id,
              });
            } else if (action === "update") {
              mutation = updateMutation.mutateAsync({
                ...item,
                project_plan_id: pld_id,
              });
            } else if (action === "delete") {
              mutation = deleteMutation.mutateAsync(id);
            }
          } else if (type === "link") {
            if (action === "create") {
              mutation = createLinkMutation.mutateAsync({
                ...item,
                project_plan_id: pld_id,
              });
            } else if (action === "update") {
              mutation = updateLinkMutation.mutateAsync({
                ...item,
                project_plan_id: pld_id,
              });
            } else if (action === "delete") {
              mutation = deleteLinkMutation.mutateAsync(id);
            }
          }

          return mutation
            .then((result) => ({ success: true, data: result }))
            .catch((error) => ({ success: false, message: error.message }));
        });

        processorInitialized.current = true;
      }

      gantt.templates.task_class = (start, end, task) => {
        if (task.priority === "High") return "high-priority";
        if (task.priority === "Medium") return "medium-priority";
        return "low-priority";
      };

      ganttInitialized.current = true;
    }

    if (data && ganttInitialized.current) {
      gantt.clearAll();
      const formattedData = {
        data:
          data.tasks.map((task) => ({
            id: task.id,
            text: task.text || "New Task",
            start_date: isValidDate(task.start_date)
              ? new Date(task.start_date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            duration: Number(task.duration) || 1,
            progress: parseFloat(task.progress) || 0,
            open: task.open,
            parent: task.parent || "0",
            priority: task.priority || "Low",
            description: task.description || "",
          })) || [],
        links: data.links || [],
      };
      gantt.parse(formattedData);
    }
  }, [
    data,
    pld_id,
    createMutation,
    updateMutation,
    deleteMutation,
    createLinkMutation,
    updateLinkMutation,
    deleteLinkMutation,
  ]);

  if (isLoading)
    return (
      <div
        style={{
          width: "100wh",
          height: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinners />
      </div>
    );
  if (isError)
    return (
      <div
        style={{
          width: "100wh",
          height: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h5 className="text-danger">Error in Loading Gantt Chart.</h5>
      </div>
    );

  return (
    <div>
      <div id="gantt_here" style={{ width: "100%", height: "500px" }}></div>
      <style>
        {`
          .high-priority { background-color: #F40009; }
          .medium-priority { background-color: orange; }
          .low-priority { background-color: steelblue; }
        `}
      </style>
    </div>
  );
};

export default memo(GanttChart);
