import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import { LoginChecker } from './components';
import { Login, Chat } from './pages';

import styles from './app.module.scss';

export default () => {

  return (
    <div className={styles.app}>
      <Router>
        <Route path="/"><LoginChecker /></Route>
        <Switch>
          <Route path="/login"><Login /></Route>
          <Route path="/chat"><Chat /></Route>
        </Switch>
      </Router>
    </div>
  );
}

