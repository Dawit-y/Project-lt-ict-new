import React, { useEffect, memo, useRef } from "react";
import axios from "axios";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import Spinners from "../../components/Common/Spinner";
import { Button } from "reactstrap";
import { useTranslation } from "react-i18next";
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

const GanttChart = ({ pld_id, name, startDate, endDate }) => {
  const { t } = useTranslation();
  const ganttInitialized = useRef(false);
  const processorInitialized = useRef(false);

  useEffect(() => {
    const fetchAndRenderTasks = async () => {
      try {
        const data = await fetchTasks(pld_id);

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
              description: task.notes || "",
            })) || [],
          links: data.links || [],
        };

        if (!ganttInitialized.current) {
          gantt.init("gantt_here");

          gantt.plugins({
            export_api: true,
          });

          gantt.config.row_height = 40;
          gantt.config.scale_height = 50;
          gantt.config.start_date = startDate;
          gantt.config.end_date = endDate;
          gantt.config.scale_unit = "week";
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
            {
              name: "notes",
              height: 70,
              map_to: "description",
              type: "textarea",
            },
            { name: "time", type: "duration", map_to: "auto" },
          ];

          gantt.locale.labels.section_text = "Task Name";
          gantt.locale.labels.section_priority = "Priority";
          gantt.locale.labels.section_notes = "Description";

          gantt.templates.task_class = (start, end, task) => {
            if (task.priority === "High") return "high-priority";
            if (task.priority === "Medium") return "medium-priority";
            return "low-priority";
          };

          ganttInitialized.current = true;
        }

        gantt.clearAll();
        gantt.parse(formattedData);

        if (!processorInitialized.current) {
          gantt.createDataProcessor(async (type, action, item, id) => {
            try {
              if (type === "task") {
                if (action === "create") {
                  await createTask({ ...item, project_plan_id: pld_id });
                } else if (action === "update") {
                  await updateTask({ ...item, project_plan_id: pld_id });
                } else if (action === "delete") {
                  await deleteTask(id);
                }
              } else if (type === "link") {
                if (action === "create") {
                  await createLink({ ...item, project_plan_id: pld_id });
                } else if (action === "update") {
                  await updateLink({ ...item, project_plan_id: pld_id });
                } else if (action === "delete") {
                  await deleteLink(id);
                }
              }
              return { success: true };
            } catch (error) {
              return { success: false, message: error.message };
            }
          });
          processorInitialized.current = true;
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    fetchAndRenderTasks();
  }, [pld_id, startDate, endDate]);

  const handleExportToPNG = () => {
    gantt.exportToPNG({
      name: `Gantt_chart_for_${name}.png`,
      raw: true,
    });
  };
  const handleExportToPDF = () => {
    gantt.exportToPDF({
      name: `Gantt_chart_for_${name}.pdf`,
      raw: true,
    });
  };

  return (
    <div>
      <div className="mb-2 d-flex">
        <Button onClick={handleExportToPNG} className="me-2">
          {t('gantt_export_image')}
        </Button>
        <Button onClick={handleExportToPDF} color="success">
         {t('gantt_export_pdf')}
        </Button>
      </div>
      <div id="gantt_here" style={{ width: "100%", height: "500px" }}></div>
      <style>
        {`
          .high-priority { background-color: #ff0000; }
          .medium-priority { background-color: #b85924; }
          .low-priority { background-color: #3db9d3; }
        `}
      </style>
    </div>
  );
};

export default memo(GanttChart);
