import React from "react";
import { useTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import { FaPrint } from "react-icons/fa";
import { UncontrolledTooltip } from "reactstrap";
import { FOOTER_TEXT, COPYRIGHT_YEAR } from "../../constants/constantFile";
import logo from "../../assets/images/logo-light.png";

const PrintTable = ({
	tableName = "Table",
	dropdownItem = false,
	pivotTableSelector = ".pvtOutput",
	exportSearchParams = {},
}) => {
	const { t } = useTranslation();

	const handlePrint = () => {
		const customHeader = getCustomHeader();
		const customFooter = getCustomFooter();

		// Get the pivot table OUTPUT content
		const pivotOutputElement = document.querySelector(pivotTableSelector);

		if (!pivotOutputElement) {
			console.error(
				"Pivot table output element not found with selector:",
				pivotTableSelector
			);
			alert(
				t("print_error") ||
					"No report output found to print. Please generate a report first."
			);
			return;
		}

		// Clone the element to avoid modifying the original DOM
		const outputClone = pivotOutputElement.cloneNode(true);

		// Remove modebar containers if they exist
		const modebarContainers =
			outputClone.querySelectorAll(".modebar-container");
		modebarContainers.forEach((container) => {
			container.remove();
		});

		// Also remove modebar directly (sometimes it's not in a container)
		const modebars = outputClone.querySelectorAll(".modebar");
		modebars.forEach((modebar) => {
			modebar.remove();
		});

		const modalContent = outputClone.innerHTML;

		if (!modalContent || modalContent.trim().length === 0) {
			console.error("Pivot table output is empty");
			alert(
				t("print_error_empty") ||
					"Report output is empty. Please generate a report first."
			);
			return;
		}

		const printWindow = window.open(
			"",
			"_blank",
			`width=${window.screen.width},height=${window.screen.height}`
		);

		if (printWindow) {
			printWindow.document.open();
			printWindow.document.write(`
        <html>
        <head>
        <title>${tableName.split(" ").join("_").toLocaleLowerCase()}_statistical_report</title>
        <style>
        /* General styles */
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background: white;
        }
        h1 {
          color: #333;
          font-size: 16px;
          margin-bottom: 10px;
        }
        
        /* Header styles */
        .report-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
        }
        
        .logo {
          max-height: 80px;
          max-width: 120px;
          object-fit: contain;
        }
        
        .header-content {
          flex: 1;
        }
        
        .header-content h1 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }
        
        .header-content h2 {
          margin: 5px 0 0 0;
          color: #333;
          font-size: 16px;
        }
        
        .header-content p {
          margin: 5px 0 0 0;
          color: #666;
          font-size: 14px;
        }
        
        /* Pivot table output specific styles */
        .pvtOutput {
          width: 100% !important;
          font-family: Arial, sans-serif;
        }
        
        /* Table styles */
        .pvtTable {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 12px;
          margin: 0 auto;
        }
        
        .pvtTable th, .pvtTable td {
          border: 1px solid #ddd !important;
          padding: 6px !important;
          text-align: left !important;
          vertical-align: top !important;
        }
        
        .pvtTable th {
          background-color: #f8f9fa !important;
          font-weight: bold !important;
          color: #495057 !important;
        }
        
        .pvtTable tr:nth-child(even) {
          background-color: #f8f9fa !important;
        }
        
        /* Plotly chart styles */
        .js-plotly-plot {
          width: 100% !important;
          height: auto !important;
          max-width: 100% !important;
        }
        
        .plot-container {
          width: 100% !important;
          height: auto !important;
        }
        
        .svg-container {
          width: 100% !important;
          height: auto !important;
        }
        
        /* Hide modebar in print */
        .modebar-container,
        .modebar {
          display: none !important;
        }
        
        /* Print-specific styles */
        @media print {
          body {
            margin: 0.5cm !important;
            padding: 0 !important;
            background: white !important;
            font-size: 12px !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .report-header {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 20px !important;
          }
          
          .logo {
            max-height: 70px !important;
            max-width: 100px !important;
          }
          
          .pvtTable {
            page-break-inside: auto !important;
            font-size: 10px !important;
          }
          
          .pvtTable tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
          
          .pvtTable th,
          .pvtTable td {
            border: 1px solid #000 !important;
            padding: 4px !important;
            font-size: 10px !important;
          }
          
          .js-plotly-plot {
            page-break-inside: avoid !important;
            max-height: 20cm !important;
          }
          
          /* Ensure modebar is hidden in print */
          .modebar-container,
          .modebar {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
          }
          
          @page {
            size: landscape;
            margin: 0.5cm;
          }
        }
        
        /* Responsive adjustments */
        @media screen and (max-width: 768px) {
          body {
            margin: 10px;
          }
          
          .report-header {
            flex-direction: column;
            gap: 10px;
          }
          
          .pvtTable {
            font-size: 10px;
          }
        }
        </style>
        </head>
        <body>
        ${customHeader}
        <div class="pivot-output-print-container">
          ${modalContent}
        </div>
        ${customFooter}
        </body>
        </html>
      `);
			printWindow.document.close();

			// Wait for content to load (especially important for charts)
			printWindow.onload = function () {
				printWindow.focus();
				printWindow.print();
				// Don't close immediately for charts to render properly
				setTimeout(() => {
					printWindow.close();
				}, 1000);
			};
		} else {
			alert(
				t("popup_blocked") ||
					"Pop-up blocked! Please allow pop-ups for this site."
			);
		}
	};

	// Function to generate custom header with logo
	const getCustomHeader = () => {
		const orgName = t("organization_name");
		const logoHtml = logo
			? `<div class="logo-container">
					<img src="${logo}" alt="${orgName} Logo" class="logo" />
				 </div>`
			: "";

		return `
    <div>
      <div class="report-header">
        ${logoHtml}
        <div class="header-content">
          <h1>${orgName}</h1>
          <h2>${tableName} Statistical Report</h2>
          <p>
            ${t("generated_on") || "Generated on"}: ${new Date().toLocaleDateString()} 
            ${new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
      ${
				exportSearchParams && Object.keys(exportSearchParams).length > 0
					? `
      <div style="margin-bottom: 20px; font-size: 14px; color: #333;">
        <strong>${t("search_criteria")}:</strong>
        <ul>
          ${Object.entries(exportSearchParams)
						.map(
							([key, value]) => `
            <li>${t(key) || key}: ${value}</li>
          `
						)
						.join("")}
        </ul>
      </div>`
					: ""
			}
    </div>
  
    `;
	};

	// Function to generate custom footer
	const getCustomFooter = () => {
		return `
      <div style="text-align: center; margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
        <p>© ${COPYRIGHT_YEAR} ${FOOTER_TEXT}. All rights reserved.</p>
        <p style="margin-top: 20px;">${t("prepared_by") || "Prepared by"}: __________________</p>
        <p style="margin-top: 10px;">${t("approved_by") || "Approved by"}: __________________</p>
      </div>
    `;
	};

	// Check if there's content to print in the output area
	const hasContent = () => {
		const pivotOutputElement = document.querySelector(pivotTableSelector);
		if (
			!pivotOutputElement ||
			!pivotOutputElement.innerHTML ||
			pivotOutputElement.innerHTML.trim().length === 0
		) {
			return false;
		}

		// Check for actual visible content
		const hasTable = pivotOutputElement.querySelector(".pvtTable");
		const hasChart = pivotOutputElement.querySelector(".js-plotly-plot");
		const hasText = pivotOutputElement.textContent.trim().length > 0;

		return hasTable || hasChart || hasText;
	};

	if (dropdownItem) {
		return (
			<DropdownItem onClick={handlePrint} disabled={!hasContent()}>
				<FaPrint className="me-1" />
				{t("print")}
			</DropdownItem>
		);
	}

	return (
		<div id="print-cont">
			<button
				id="print-button"
				className="btn btn-soft-primary"
				onClick={handlePrint}
				disabled={!hasContent()}
			>
				<FaPrint className="me-1" />
			</button>
			<UncontrolledTooltip placement="top" target="print-button">
				{t("print_tooltip") || "Print current report view"}
			</UncontrolledTooltip>
		</div>
	);
};

export default PrintTable;
