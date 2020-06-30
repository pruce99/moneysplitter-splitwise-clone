import * as React from "react";
import PeopleList, { IPersonListItem } from "../actual/PeopleList";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IAppState } from "../../reducer/reducer";
import { Person } from "../../Logic/Logic";
import {
  clearProducts,
  ClearProductsAction,
  deletePerson,
  DeletePersonAction,
  SelectAction,
  selectPerson,
} from "../../action/actions";
import Button from "../design/Button";
import AddPerson from "./AddPerson";
import EditPerson from "./EditPerson";

interface IPeopleSectionProps {
  people: IPersonListItem[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onClearProducts: (id: number) => void;
}

interface IPeopleSectionState {
  isEditing: boolean;
}

class PeopleSectionRaw extends React.Component<
  IPeopleSectionProps,
  IPeopleSectionState
> {
  public constructor(props: IPeopleSectionProps | any) {
    super(props);

    this.state = {
      isEditing: false,
    };
  }

  public render() {
    const toolbox =
      this.props.activeId !== null ? (
        this.renderToolbox()
      ) : (
        <small style={{ color: "bisque" }}>No person selected</small>
      );

    const selectedPerson = this.props.people.find(
      (p) => p.id === this.props.activeId
    );
    const initialName = selectedPerson ? selectedPerson.name : "N/A";

    return (
      <div>
        <PeopleList
          people={this.props.people}
          activeId={this.props.activeId}
          onPersonClick={(id: number) => this.props.onSelect(id)}
        />
        {this.state.isEditing ? "" : toolbox}

        {this.state.isEditing ? (
          <EditPerson
            personId={this.props.activeId}
            initialName={initialName}
            onFinished={() => {
              this.setState({ isEditing: false });
            }}
          />
        ) : (
          <AddPerson />
        )}
      </div>
    );
  }

  private renderToolbox() {
    return (
      <section className="form-group" id="edit-buttons">
        <div>
          <small style={{ color: "bisque" }}>Selected:</small>
        </div>
        <Button
          text="Edit"
          onClick={() => {
            this.setState({ isEditing: true });
          }}
          icon="glyphicon-pencil"
        />
        <Button
          text="Delete"
          onClick={this.handleDelete.bind(this)}
          icon="glyphicon-remove"
        />
        <Button
          text="Clear products"
          onClick={this.handleClearProducts.bind(this)}
        />
      </section>
    );
  }

  private handleDelete() {
    const { activeId, onDelete } = this.props;
    if (activeId !== null) onDelete(activeId);
  }

  private handleClearProducts() {
    const { activeId, onClearProducts } = this.props;
    if (activeId !== null) onClearProducts(activeId);
  }
}

const mapStateToProps = (state: IAppState, ownProps: any) => {
  return {
    people: Person.getListItems(state.people),
    activeId: state.selectedPersonId,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<SelectAction | DeletePersonAction | ClearProductsAction>,
  ownProps: any
) => {
  return {
    onSelect: (id: number) => dispatch(selectPerson(id)),
    onDelete: (id: number) => dispatch(deletePerson(id)),
    onClearProducts: (id: number) => dispatch(clearProducts(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PeopleSectionRaw);
