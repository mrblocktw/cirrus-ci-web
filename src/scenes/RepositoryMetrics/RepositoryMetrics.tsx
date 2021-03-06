import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import RepositoryMetricsPage from '../../components/metrics/RepositoryMetricsPage';
import { RepositoryMetricsQuery } from './__generated__/RepositoryMetricsQuery.graphql';
import { RouteComponentProps, withRouter } from 'react-router';

interface Props extends RouteComponentProps<{ owner: 'owner'; name: 'name' }> {}

class RepositoryMetrics extends React.Component<Props> {
  render() {
    return (
      <QueryRenderer<RepositoryMetricsQuery>
        environment={environment}
        variables={this.props.match.params}
        query={graphql`
          query RepositoryMetricsQuery($owner: String!, $name: String!) {
            githubRepository(owner: $owner, name: $name) {
              ...RepositoryMetricsPage_repository
            }
          }
        `}
        render={({ error, props }) => {
          if (!props) {
            return <CirrusLinearProgress />;
          }
          if (!props.githubRepository) {
            return <NotFound message={error} />;
          }
          return <RepositoryMetricsPage repository={props.githubRepository} {...this.props} />;
        }}
      />
    );
  }
}

export default withRouter(RepositoryMetrics);
