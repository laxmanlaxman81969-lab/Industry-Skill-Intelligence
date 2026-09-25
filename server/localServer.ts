import app from './index';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Skill Intelligence Backend API running on port ${PORT}`);
  console.log(`👉 Health: http://localhost:${PORT}/api/health`);
  console.log(`👉 Skill Analyzer: http://localhost:${PORT}/api/skill-analyzer/status`);
  console.log(`=======================================================`);
});
