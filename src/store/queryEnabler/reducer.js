const CHANGE_BUDGET_REQUEST = "CHANGE_BUDGET_REQUEST";
const CHANGE_BUDGET_REQUEST_CSO = "CHANGE_BUDGET_REQUEST_CSO";

export const changeBudgetRequest = (payload) => ({
	type: CHANGE_BUDGET_REQUEST,
	payload,
});

export const changeBudgetRequestCSO = (payload) => ({
	type: CHANGE_BUDGET_REQUEST_CSO,
	payload,
});

const INIT_STATE = {
	budgetRequest: false,
	budgetRequestCSO: false,
};

const QueryEnabler = (state = INIT_STATE, action) => {
	switch (action.type) {
		case CHANGE_BUDGET_REQUEST:
			return {
				...state,
				budgetRequest: action.payload,
			};
		case CHANGE_BUDGET_REQUEST_CSO:
			return {
				...state,
				budgetRequestCSO: action.payload,
			};
		default:
			return state;
	}
};

export default QueryEnabler;
