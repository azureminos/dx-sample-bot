import _ from 'lodash';
import React, {createElement} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables & Functions
const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});
class PackageSummary extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    this.doHandleDragItem = this.doHandleDragItem.bind(this);
    // Init data
    // Setup state
  }
  // Event Handlers
  doHandleDragItem(result) {
    console.log('>>>>PackageSummary.doHandleDragItem', result);
    const {actions} = this.props;
    if (actions && actions.handleDragItem) {
      actions.handleDragItem(result);
    }
  }
  // Display Widget
  render() {
    const {classes, plan, planExt, reference, actions} = this.props;
    console.log('>>>>PackageSummary, render()', {plan, actions});
    // Local Functions
    const getDayBlock = (day) => {
      // console.log('>>>>DnD.getDayBlock', day);
      let sCities = '';
      for (let i = 0; day.cities && i < day.cities.length; i++) {
        const c = day.cities[i];
        sCities = `${sCities}${c.name}, `;
      }
      sCities = sCities ? sCities.substring(0, sCities.length - 2) : '';
      return (
        <Droppable key={`day##${day.dayNo}`} droppableId={`day##${day.dayNo}`}>
          {(provided, snapshot) => (
            <div>
              <div>{`Day ${day.dayNo}, ${sCities}`}</div>
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      );
    };
    // Local Variables
    // Sub Components
    // Display Widget
    return (
      <DragDropContext onDragEnd={this.doHandleDragItem}>
        {_.map(plan.days, (day) => {
          return getDayBlock(day);
        })}
      </DragDropContext>
    );
  }
}

export default withStyles(styles)(PackageSummary);
