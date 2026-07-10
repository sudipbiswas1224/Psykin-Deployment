import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isCrisisDetected: false,
    crisisLevel: null, // 'high' | null
    fallbackSuggestions: [],
    lastTriggeredAt: null
};

const crisisSlice = createSlice({
    name: 'crisis',
    initialState,
    reducers: {
        triggerCrisis: (state, action) => {
            state.isCrisisDetected = true;
            state.crisisLevel = action.payload.crisisLevel || 'high';
            state.fallbackSuggestions = action.payload.fallbackSuggestions || ['grounding_exercise', 'helpline_directory'];
            state.lastTriggeredAt = new Date().toISOString();
        },
        dismissCrisis: (state) => {
            state.isCrisisDetected = false;
            state.crisisLevel = null;
            state.fallbackSuggestions = [];
        },
        resetCrisis: (state) => {
            return initialState;
        }
    }
});

export const { triggerCrisis, dismissCrisis, resetCrisis } = crisisSlice.actions;
export default crisisSlice.reducer;
