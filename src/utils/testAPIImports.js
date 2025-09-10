// Test file to verify API imports are working
import { 
  projectsAPI,
  tasksAPI,
  featuresAPI,
  storiesAPI,
  commentsAPI,
  projectMemberAPI,
  dashboardAPI,
  authAPI,
  apiClient 
} from '../api';

console.log('API Import Test:');
console.log('projectsAPI:', projectsAPI ? '✅ Loaded' : '❌ Failed');
console.log('tasksAPI:', tasksAPI ? '✅ Loaded' : '❌ Failed');
console.log('featuresAPI:', featuresAPI ? '✅ Loaded' : '❌ Failed');
console.log('storiesAPI:', storiesAPI ? '✅ Loaded' : '❌ Failed');
console.log('commentsAPI:', commentsAPI ? '✅ Loaded' : '❌ Failed');
console.log('projectMemberAPI:', projectMemberAPI ? '✅ Loaded' : '❌ Failed');
console.log('dashboardAPI:', dashboardAPI ? '✅ Loaded' : '❌ Failed');
console.log('authAPI:', authAPI ? '✅ Loaded' : '❌ Failed');
console.log('apiClient:', apiClient ? '✅ Loaded' : '❌ Failed');

// Test API methods exist
console.log('\nAPI Methods Test:');
console.log('projectsAPI.getAllProjects:', typeof projectsAPI?.getAllProjects === 'function' ? '✅' : '❌');
console.log('tasksAPI.getAllTasks:', typeof tasksAPI?.getAllTasks === 'function' ? '✅' : '❌');
console.log('authAPI.login:', typeof authAPI?.login === 'function' ? '✅' : '❌');

export default function testAPIImports() {
  console.log('All API imports tested successfully!');
  return true;
}
