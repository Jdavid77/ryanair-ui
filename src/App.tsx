import { QueryProvider } from './providers/QueryProvider';
import { Layout } from './components/common/Layout';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <QueryProvider>
      <Layout>
        <HomePage />
      </Layout>
    </QueryProvider>
  );
}

export default App;
