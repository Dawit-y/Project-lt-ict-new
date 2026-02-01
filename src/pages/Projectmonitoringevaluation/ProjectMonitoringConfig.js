// config/projectMonitoringConfig.js

export const PROJECT_TYPES = {
	GOV: "gov",
	CSO: "cso",
	CITIZEN: "citizen",
};

export const getProjectTypeConfig = (projectType) => {
	const baseConfig = {
		// Form field configurations
		fields: {
			// Basic Information
			mne_transaction_type_id: {
				label: "mne_transaction_type",
				required: true,
				visible: true,
				component: "select",
				options: [
					{ value: 1, label: "monitoring" },
					{ value: 2, label: "evaluation" },
				],
			},
			mne_visit_type: {
				label: "mne_visit_type",
				required: true,
				visible: true,
				component: "select",
				options: [
					{ value: 1, label: "Regular" },
					{ value: 2, label: "Surprise" },
				],
			},
			mne_type_id: {
				label: "mne_type_id",
				required: true,
				visible: true,
				component: "async-select",
			},

			// Progress Metrics
			mne_physical_region: {
				label: "regional_physical",
				required: false,
				visible: true,
				component: "formatted-amount",
				suffix: "%",
				maxValue: 100,
			},
			mne_financial_region: {
				label: "regional_financial",
				required: false,
				visible: true,
				component: "formatted-amount",
			},
			mne_physical_zone: {
				label: "zonal_physical",
				required: false,
				visible: true,
				component: "formatted-amount",
				suffix: "%",
				maxValue: 100,
			},
			mne_financial_zone: {
				label: "zonal_financial",
				required: false,
				visible: true,
				component: "formatted-amount",
			},
			mne_physical: {
				label: "woreda_physical",
				required: false,
				visible: true,
				component: "formatted-amount",
				suffix: "%",
				maxValue: 100,
			},
			mne_financial: {
				label: "woreda_financial",
				required: false,
				visible: true,
				component: "formatted-amount",
			},

			// Timeline
			mne_record_date: {
				label: "record_date",
				required: true,
				visible: true,
				component: "date-picker",
			},
			mne_start_date: {
				label: "start_date",
				required: true,
				visible: true,
				component: "date-picker",
			},
			mne_end_date: {
				label: "end_date",
				required: true,
				visible: true,
				component: "date-picker",
			},

			// Team and Findings
			mne_team_members: {
				label: "mne_team_members",
				required: true,
				visible: true,
				component: "textarea",
				maxLength: 420,
			},

			// Evaluation Results
			mne_feedback: {
				label: "mne_feedback",
				required: false,
				visible: true,
				component: "textarea",
				maxLength: 420,
			},
			mne_weakness: {
				label: "mne_weakness",
				required: false,
				visible: true,
				component: "textarea",
				maxLength: 420,
			},
			mne_challenges: {
				label: "mne_challenges",
				required: false,
				visible: true,
				component: "textarea",
				maxLength: 420,
			},
			mne_recommendations: {
				label: "mne_recommendations",
				required: false,
				visible: true,
				component: "textarea",
				maxLength: 420,
			},
			mne_purpose: {
				label: "mne_purpose",
				required: false,
				visible: true,
				component: "textarea",
				maxLength: 420,
			},
			mne_strength: {
				label: "mne_strength",
				required: false,
				visible: true,
				component: "textarea",
				maxLength: 420,
			},
			mne_description: {
				label: "mne_description",
				required: false,
				visible: true,
				component: "rich-text",
			},
		},

		// Section configurations
		sections: {
			basicInfo: {
				title: "basic_information",
				visible: true,
				fields: ["mne_transaction_type_id", "mne_visit_type", "mne_type_id"],
			},
			progressMetrics: {
				title: "progress_metrics",
				visible: true,
				tabs: {
					regional: {
						title: "regional_level",
						icon: "mdi mdi-map-marker-multiple",
						visible: true,
						fields: ["mne_physical_region", "mne_financial_region"],
					},
					zonal: {
						title: "zonal_level",
						icon: "mdi mdi-map-marker-outline",
						visible: true,
						fields: ["mne_physical_zone", "mne_financial_zone"],
					},
					woreda: {
						title: "woreda_level",
						icon: "mdi mdi-map-marker-radius",
						visible: true,
						fields: ["mne_physical", "mne_financial"],
					},
				},
			},
			timeline: {
				title: "timeline",
				visible: true,
				fields: ["mne_record_date", "mne_start_date", "mne_end_date"],
			},
			teamFindings: {
				title: "team_and_findings",
				visible: true,
				fields: ["mne_team_members"],
			},
			evaluationResults: {
				title: "evaluation_results",
				visible: true,
				fields: [
					"mne_feedback",
					"mne_weakness",
					"mne_challenges",
					"mne_recommendations",
					"mne_purpose",
					"mne_strength",
					"mne_description",
				],
			},
		},

		// Table column configurations
		tableColumns: {
			showFinancialColumns: true,
			showPhysicalColumns: true,
			showRegionalLevel: true,
			showZonalLevel: true,
			showWoredaLevel: true,
			showActionButtons: true,
			exportConfig: {
				includeFinancials: true,
				includePhysicals: true,
			},
		},

		// Validation schema modifications
		validation: {
			// Fields that should be required for this project type
			requiredFields: [
				"mne_transaction_type_id",
				"mne_visit_type",
				"mne_type_id",
				"mne_team_members",
				"mne_record_date",
				"mne_start_date",
				"mne_end_date",
			],

			// Custom validation rules
			customRules: {},
		},
	};

	// Project-specific overrides
	const projectTypeOverrides = {
		[PROJECT_TYPES.CSO]: {
			fields: {
				mne_financial: {
					label: "cso_financial_progress",
					required: true,
					visible: true,
				},
				mne_physical: {
					label: "cso_physical_progress",
					required: true,
					visible: true,
				},
				// Add CSO-specific fields
				cso_partner_name: {
					label: "cso_partner_name",
					required: true,
					visible: true,
					component: "input",
					placeholder: "Enter CSO partner name",
				},
				partnership_type: {
					label: "partnership_type",
					required: false,
					visible: true,
					component: "select",
					options: [
						{ value: 1, label: "Implementing Partner" },
						{ value: 2, label: "Funding Partner" },
						{ value: 3, label: "Technical Partner" },
					],
				},
			},
			sections: {
				progressMetrics: {
					tabs: {
						regional: { visible: false },
						zonal: { visible: false },
					},
				},
				teamFindings: {
					fields: ["mne_team_members", "cso_partner_name", "partnership_type"],
				},
			},
			tableColumns: {
				showRegionalLevel: false,
				showZonalLevel: false,
			},
		},

		[PROJECT_TYPES.CITIZEN]: {
			// default config making it the same with baseconfig
		},
		[PROJECT_TYPES.GOV]: {
			// default config making it the same with baseconfig
		},
	};

	// Merge base config with project type overrides
	const config = deepMerge(baseConfig, projectTypeOverrides[projectType] || {});

	return config;
};

// Helper function for deep merging objects
const deepMerge = (target, source) => {
	const output = { ...target };

	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			if (isObject(source[key])) {
				if (!(key in target)) {
					Object.assign(output, { [key]: source[key] });
				} else {
					output[key] = deepMerge(target[key], source[key]);
				}
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		});
	}

	return output;
};

const isObject = (item) => {
	return item && typeof item === "object" && !Array.isArray(item);
};
