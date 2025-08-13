import React from "react";
import { Button } from "reactstrap";
import { FaFileExcel } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";

const ExportToExcel = ({ data = [], exportColumns }) => {
	console.log("Exporting data:", data);
	const { t } = useTranslation();
	const handleExport = async () => {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Project Physical Performance", {
			views: [{ showGridLines: false }],
		});

		// Add headers
		const headers = exportColumns.map((col) => ({
			header: t(col.label),
			key: col.id,
			width: col.minWidth / 7, // ExcelJS uses character width, not pixel width
		}));
		worksheet.columns = headers;

		// Add rows
		data.forEach((project) => {
			const row = worksheet.addRow(project);
			row.eachCell((cell) => {
				cell.alignment = { horizontal: "center" };
			});
		});

		// Apply borders to all cells
		worksheet.eachRow((row) => {
			row.eachCell((cell) => {
				cell.border = {
					top: { style: "thin" },
					left: { style: "thin" },
					bottom: { style: "thin" },
					right: { style: "thin" },
				};
			});
		});

		// Adjust column widths
		worksheet.columns.forEach((column) => {
			let maxLength = 0;
			column.eachCell({ includeEmpty: true }, (cell) => {
				const length = cell.value ? cell.value.toString().length : 0;
				maxLength = Math.max(maxLength, length);
			});
			column.width = Math.min(Math.max(maxLength + 2, 8), 20);
		});

		// Download
		const buffer = await workbook.xlsx.writeBuffer();
		saveAs(
			new Blob([buffer]),
			`project_physical_performance_${new Date()
				.toISOString()
				.slice(0, 10)}.xlsx`
		);
	};

	return (
		<Button color="success" onClick={handleExport}>
			<FaFileExcel className="" />
		</Button>
	);
};

export default ExportToExcel;
