import React, { createContext, useContext, useState } from 'react';

export const LeaderboardContext = createContext();

export function useLeaderboardContext() {
  return useContext(LeaderboardContext);
}
