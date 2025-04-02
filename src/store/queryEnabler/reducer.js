const CHANGE_BUDGET_REQUEST = "CHANGE_BUDGET_REQUEST";

export const changeBudgetRequest = (payload) => ({
	type: CHANGE_BUDGET_REQUEST,
	payload,
});

const INIT_STATE = {
	budgetRequest: false,
};

const QueryEnabler = (state = INIT_STATE, action) => {
	switch (action.type) {
		case CHANGE_BUDGET_REQUEST:
			return {
				...state,
				budgetRequest: action.payload,
			};
		default:
			return state;
	}
};

export default QueryEnabler;
