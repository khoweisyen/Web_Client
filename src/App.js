import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import * as Base from './base/web_base';
import './App.css';

import SearchContainer from './component/SearchContainer';
import Axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result_list: [],
      search_text: '',
      states_msg: '',
      search_mode: 0,
      min_page: 1,
      max_page: 1,
      current_page: 1,
      show_range_left: 1,
      show_range_right: 10,
      req_page_update: false
    };
  }

  componentDidMount() {
    document.title = 'Car Service Apps';
  }

  componentDidUpdate() {
    if (this.state.req_page_update == true) {
      this.PageFormulation();
    }
  }

  HandleSearchText = (state, text, pos) => {
    this.setState({ search_text: text, states_msg: state, search_mode: pos });

    switch (state) {
      case 'text_tx':
        {
          if (pos == 0) {
            Axios.get(`https://web-srv.herokuapp.com/services/set_data`)
              .then(res => {
                Axios.get(
                  `https://web-srv.herokuapp.com/services/get_data?SearchTxt=${text}`
                )
                  .then(res_2 => {
                    this.setState({
                      result_list: res_2.data.data,
                      req_page_update: true
                    });
                  })
                  .catch(err => {
                    alert('Server error!');
                  });
              })
              .catch(err => {
                alert('Server error!');
              });
          } else {
            Axios.get(`https://web-srv.herokuapp.com/accessories/set_data`)
              .then(res => {
                Axios.get(
                  `https://web-srv.herokuapp.com/accessories/get_data?SearchTxt=${text}`
                )
                  .then(res_2 => {
                    this.setState({
                      result_list: res_2.data.data,
                      req_page_update: true
                    });
                  })
                  .catch(err => {
                    alert('Server error!');
                  });
              })
              .catch(err => {
                alert('Server error!');
              });
          }
        }
        break;

        //case 'sort_up':
        {
          this.setState({
            result_list: this.state.result_list.sort(function(a, b) {
              const charA = a.name.toUpperCase();
              const charB = b.name.toUpperCase();

              let comparison = 0;

              if (charA < charB) comparison = 1;
              else comparison = -1;

              return comparison;
            })
          });
        }
      //break;

      case 'sort_down':
        {
          this.setState({
            result_list: this.state.result_list.sort(function(a, b) {
              const charA = a.name.toUpperCase();
              const charB = b.name.toUpperCase();

              let comparison = 0;

              if (charA > charB) comparison = 1;
              else comparison = -1;

              return comparison;
            })
          });
        }
        break;
    }
  };

  PageFormulation = () => {
    var arr_size = this.state.result_list.length;
    var max_size =
      parseInt(arr_size / 10) -
      (arr_size % 10 == 0 ? (arr_size > 10 ? 0 : 1) : arr_size < 10 ? 0 : -1);
    console.log(max_size);
    this.setState({ max_page: max_size, req_page_update: false });
  };

  GoNextPage = () => {
    this.SetRanges(this.state.current_page + 1);
    this.setState({ current_page: this.state.current_page + 1 });
  };

  GoPrevPage = () => {
    this.SetRanges(this.state.current_page - 1);
    this.setState({ current_page: this.state.current_page - 1 });
  };

  /**
   * @param {Number} pos
   */
  SetRanges = pos => {
    var max = pos * 10;
    var min = max - 9;

    this.setState({ show_range_left: min, show_range_right: max });
  };

  render = () => {
    const loop_page = () => {
      var jsxs = [];

      for (var i = 0; i < this.state.max_page; i++) {
        jsxs.push(
          <li
            key={i}
            className={`page-item ${
              this.state.current_page == i + 1 ? 'disabled' : ''
            }`}
          >
            <a className="page-link" href="javascript:void(0);">
              {i + 1}
            </a>
          </li>
        );
      }

      return jsxs;
    };

    return (
      <div>
        <Base.WebHeader />
        <div className="container">
          <div className="row">
            <div
              className="col-lg-12"
              style={{ marginTop: '20px', marginBottom: '20px' }}
            >
              <SearchContainer
                onSearchReqs={this.HandleSearchText.bind(this)}
              />
            </div>
          </div>
          <div className="row">
            <div
              className="col-lg-12"
              style={{ marginTop: '20px', marginBottom: '20px' }}
            >
              {this.state.result_list.length > 0 ? (
                this.state.result_list
                  .slice(
                    this.state.show_range_left - 1,
                    this.state.show_range_right - 1
                  )
                  .map((val, ind) => {
                    return (
                      <div
                        key={ind}
                        className="card"
                        style={{ marginBottom: '20px' }}
                      >
                        <div className="card-body bg-primary">
                          <div className="row">
                            <div className="col-8 text-left text-white">
                              Shop Name: <strong>{val.name}</strong>
                              <br />
                              Vicinity: <strong>{val.vicinity}</strong>
                            </div>
                            <div className="col-4 text-right text-white">
                              <strong>{val.score_rating} of 5.0</strong>
                              <br />
                              Total Rating: <strong>{val.ttl_rating}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="card bg-danger">
                  <div className="card-body text-center text-white">
                    <i className="fas fa-exclamation-triangle" />
                    &nbsp; No Data Found!
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${
                    this.state.current_page == this.state.min_page
                      ? 'disabled'
                      : ''
                  }`}
                >
                  <a
                    className={`page-link`}
                    href="javascript:void(0)"
                    onClick={e => this.GoPrevPage()}
                  >
                    Previous
                  </a>
                </li>
                {loop_page()}
                <li
                  className={`page-item ${
                    this.state.current_page == this.state.max_page
                      ? 'disabled'
                      : ''
                  }`}
                >
                  <a
                    className="page-link"
                    href="javascript:void(0);"
                    onClick={e => this.GoNextPage()}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Base.WebFooter />
      </div>
    );
  };
}

export default App;
