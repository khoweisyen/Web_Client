import React, { Component } from 'react';

class SearchContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked_val: 0
    };
  }

  componentDidMount() {}

  SearchKeyPress = e => {
    if (e.key == 'Enter' || e.keyCodee == 13) {
      this.props.onSearchReqs(
        'text_tx',
        this.SearchBox.value,
        this.state.checked_val
      );
    }
  };

  SortUp = () => {
    this.props.onSearchReqs('sort_up', null, -1);
  };

  SortDown = () => {
    this.props.onSearchReqs('sort_down', null, -1);
  };

  SetChecked = (e, types) => {
    this.setState({ checked_val: types });
  };

  render = () => {
    return (
      <div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className=" fa fa-car" />
              
            </span>
          </div>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Enter search text"
            onKeyPress={e => this.SearchKeyPress(e)}
            ref={c => (this.SearchBox = c)}
          />
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={e => this.SortDown()}
            >
              <i className="fas fa-sort-amount-down" />
              
            </button>
           
          </div>
        </div>
        <div className="text-right">
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              id="customRadio"
              name="example"
              value="1"
              onChange={e => this.SetChecked(e, 1)}
            />
            <label className="custom-control-label" for="customRadio">
               Car Accesories Shop
            </label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              id="customRadio2"
              name="example"
              value="2"
              defaultChecked={true}
              onChange={e => this.SetChecked(e, 0)}
            />
            <label className="custom-control-label" for="customRadio2">
               Car Repair Shop
            </label>
          </div>
        </div>
      </div>
    );
  };
}

export default SearchContainer;
