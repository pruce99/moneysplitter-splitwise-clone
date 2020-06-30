import * as React from 'react';
import NiceList from "../design/NiceList";
import NiceListItem from "../design/NiceListItem";

export interface IPersonListItem {
    id: number;
    name: string;
    cost: number;
}

interface IPeopleListProps {
    people: IPersonListItem[];
    onPersonClick: (id: number) => void;
    activeId?: number | null;
}

const PeopleList: React.SFC<IPeopleListProps> = (props) => {
    let items: any[] = [];
    props.people.forEach((p, idx) =>
        items.push(<NiceListItem key={idx}
                                 text={p.name}
                                 isActive={props.activeId === p.id}
                                 badgeText={p.cost > 0 ? p.cost.toFixed(2) + ' $' : ''}
                                 onClick={() => props.onPersonClick(p.id)}/>));

    return (<NiceList children={items}/>);
};

PeopleList.defaultProps = {
    activeId: null
};

export default PeopleList;