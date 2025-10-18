import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './components/providers/queryClient';
import BottomAppNavigator from './navigation/BottomAppNavigator';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BottomAppNavigator />
    </QueryClientProvider>
  );
}