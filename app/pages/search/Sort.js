import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { injectT } from 'i18n';
import CONSTANTS from '../../constants/AppConstants';
import SelectControl from './controls/SelectControl';

export class UnconnectedSort extends Component {
  getSortOptions = () => {
    const { lang, t } = this.props;

    return [
      { label: t('SortBy.name.label'), value: CONSTANTS.SORT_BY_OPTIONS.NAME.replace('lang', lang) },
      { label: t('SortBy.type.label'), value: CONSTANTS.SORT_BY_OPTIONS.TYPE.replace('lang', lang) },
      { label: t('SortBy.premise.label'), value: CONSTANTS.SORT_BY_OPTIONS.PREMISES.replace('lang', lang) },
      { label: t('SortBy.people.label'), value: CONSTANTS.SORT_BY_OPTIONS.PEOPLE },
    ];
  }

  render() {
    const sortValue = this.props.sortValue;
    const getSortOptions = this.getSortOptions();
    const option = getSortOptions.find(options => options.value === sortValue);

    const label = !option ? this.props.t('SortBy.premise.label') : option.label;
    return (
      <div>
        <div className="visually-hidden Sorting_Accessability" role="status">
          {this.props.t('SortBy.sortingStyle') + label}
        </div>
        <SelectControl
          id="app-Sort"
          isLoading={false}
          label={this.props.t('SortBy.label')}
          onChange={({ value }) => this.props.onChange(value)}
          options={this.getSortOptions()}
          value={this.props.sortValue}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.intl.locale
});

export default connect(
  mapStateToProps,
  {}
)(injectT(UnconnectedSort));


UnconnectedSort.propTypes = {
  lang: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  sortValue: PropTypes.string,
};
