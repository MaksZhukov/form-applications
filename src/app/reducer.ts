type FilterState = {
	selectedOrganizationId: string;
};

enum ActionKind {
	setSelectedOrganizationId = 'SET_SELECTED_ORGANIZATION_ID',
}

type Action = {
	type: ActionKind;
	payload: any;
};

export const setSelectedOrganizationIdAction = (payload: string) => ({
	type: ActionKind.setSelectedOrganizationId,
	payload,
});

export const reducer = (state: FilterState, action: Action) => {
	const { type, payload } = action;
	switch (type) {
		case ActionKind.setSelectedOrganizationId:
			return {
				...state,
				selectedOrganizationId: payload.selectedOrganizationId,
			};
		default:
			return state;
	}
};
