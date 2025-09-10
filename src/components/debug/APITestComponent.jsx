import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  Button, 
  Badge, 
  Heading,
  Alert,
  AlertIcon,
  useToast 
} from '@chakra-ui/react';

// Test imports from API
import { 
  projectsAPI, 
  tasksAPI, 
  dashboardAPI, 
  authAPI 
} from '../api';

/**
 * API Test Component - Temporary component to verify API imports work
 * Remove this after confirming everything works
 */
const APITestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const toast = useToast();

  const runAPITests = async () => {
    setIsRunning(true);
    const results = {};

    // Test 1: Check if API objects are imported correctly
    try {
      results.imports = {
        projectsAPI: !!projectsAPI,
        tasksAPI: !!tasksAPI,
        dashboardAPI: !!dashboardAPI,
        authAPI: !!authAPI,
      };
    } catch (error) {
      results.imports = { error: error.message };
    }

    // Test 2: Check if API methods exist
    try {
      results.methods = {
        projectsGetAll: typeof projectsAPI?.getAllProjects === 'function',
        tasksGetAll: typeof tasksAPI?.getAllTasks === 'function',
        dashboardGetData: typeof dashboardAPI?.getDashboardData === 'function',
        authLogin: typeof authAPI?.login === 'function',
      };
    } catch (error) {
      results.methods = { error: error.message };
    }

    // Test 3: Test dashboard API (which imports other APIs)
    try {
      // This will test if the dashboard can import other APIs correctly
      results.dashboardImports = {
        canInstantiate: !!dashboardAPI,
        hasGetData: typeof dashboardAPI?.getDashboardData === 'function',
        hasGetOverview: typeof dashboardAPI?.getOverview === 'function',
      };
    } catch (error) {
      results.dashboardImports = { error: error.message };
    }

    setTestResults(results);
    setIsRunning(false);

    // Show success message
    const allPassed = Object.values(results).every(test => 
      typeof test === 'object' && !test.error && 
      Object.values(test).every(val => val === true)
    );

    toast({
      title: allPassed ? 'All API Tests Passed!' : 'Some Tests Failed',
      description: allPassed ? 'API imports are working correctly' : 'Check console for details',
      status: allPassed ? 'success' : 'warning',
      duration: 3000,
    });
  };

  useEffect(() => {
    // Auto-run tests on mount
    runAPITests();
  }, []);

  const renderTestSection = (title, testObj) => {
    if (!testObj) return null;

    const hasError = testObj.error;
    const allPassed = !hasError && Object.values(testObj).every(val => val === true);

    return (
      <Box>
        <Text fontSize="sm" fontWeight="bold" mb={2}>
          {title}:
        </Text>
        <VStack spacing={1} align="stretch">
          {hasError ? (
            <Alert status="error" size="sm">
              <AlertIcon />
              <Text fontSize="xs">{testObj.error}</Text>
            </Alert>
          ) : (
            Object.entries(testObj).map(([key, value]) => (
              <Box key={key} display="flex" justifyContent="space-between">
                <Text fontSize="xs">{key}:</Text>
                <Badge 
                  size="sm" 
                  colorScheme={value ? 'green' : 'red'}
                >
                  {value ? '✅' : '❌'}
                </Badge>
              </Box>
            ))
          )}
        </VStack>
      </Box>
    );
  };

  return (
    <Box p={4} bg="gray.50" borderRadius="md" maxW="400px">
      <Heading size="sm" mb={4}>
        🧪 API Import Test Results
      </Heading>
      
      <VStack spacing={4} align="stretch">
        {renderTestSection('Import Tests', testResults.imports)}
        {renderTestSection('Method Tests', testResults.methods)}
        {renderTestSection('Dashboard Import Tests', testResults.dashboardImports)}
        
        <Button 
          size="sm" 
          onClick={runAPITests}
          isLoading={isRunning}
          loadingText="Testing..."
          colorScheme="blue"
        >
          Re-run Tests
        </Button>
        
        <Text fontSize="xs" color="gray.600" textAlign="center">
          This is a temporary test component.<br/>
          Remove it after confirming APIs work correctly.
        </Text>
      </VStack>
    </Box>
  );
};

export default APITestComponent;
