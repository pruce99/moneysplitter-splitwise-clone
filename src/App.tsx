/* eslint-disable jsx-a11y/alt-text */
import * as React from "react";
import "./App.css";
import "./main.css";
import Logo from "./logo.svg";
import ProductSection from "./components/operations/ProductSection";
import PeopleSection from "./components/operations/PeopleSection";
import ResultsSection from "./components/operations/ResultsSection";
import Button from "./components/design/Button";
import { clearPeople } from "./action/actions";

class App extends React.Component<{ store: any | undefined }> {
  public render() {
    return this.renderLayout();
  }

  private renderLayout() {
    return (
      <div className="container-fluid">
        <div className="row header App-header">
          <img src={Logo} className="App-logo" />
          <h1>Splitwise Tool</h1>
        </div>
        <div className="row content">
          <section className="col-sm-3 sidenav">
            <h4 style={{color: 'bisque'}}>
              People{" "}
              <Button
                text="Clear"
                btnStyle="btn-default btn-xs"
                onClick={this.handleClearPeople.bind(this)}
              />
            </h4>
            <PeopleSection />
          </section>
          <section className="col-sm-6">
            <h2 >RESULTS</h2>
            <ResultsSection />
          </section>
          <section className="col-sm-3 sidenav">
            <h4 style={{color: 'bisque'}}>Product list</h4>
            <ProductSection />
          </section>
        </div>
      </div>
    );
  }

  private handleClearPeople() {
    this.props.store.dispatch(clearPeople());
  }
}

export default App;
