// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
import { AuthContextProvider } from './firebaseConfig/firebaseConfig';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        <Router />
      </AuthContextProvider>
    </ThemeProvider>
  );
}
