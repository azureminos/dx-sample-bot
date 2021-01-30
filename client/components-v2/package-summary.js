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
    this.doHandleDrag = this.doHandleDrag.bind(this);
    // Init data
    // Setup state
  }
  // Event Handlers
  doHandleDragItem(result) {
    console.log('>>>>PackageSummary.doHandleDragItem', result);
    const {handleDragItem} = this.props.actions;
    if (handleDragItem) handleDragItem(result);
  }
  // Display Widget
  render() {
    const {classes, plan, planExt, reference, actions} = this.props;
    console.log('>>>>PackageSummary, render()', {});
    // Local Functions
    const getDayItemsBlock = (dayNo, item, index) => {
      console.log('>>>>DnD.getDayItemsBlock', {item, index});
      const uItemId = `dnd-item-${dayNo}-${item._id}`;
      return (
        <Draggable key={uItemId} draggableId={uItemId} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              {item.name}
            </div>
          )}
        </Draggable>
      );
    };
    const getDayBlock = (day) => {
      console.log('>>>>DnD.getDayBlock', day);
      const {items} = day;
      return (
        <div>
          <div>{`Day ${day.dayNo}, ${day.startCity} >> ${day.endCity}`}</div>
          <Droppable droppableId={`dnd-day-${day.dayNo}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {items.map((item, index) => {
                  getDayItemsBlock(day.dayNo, item, index);
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      );
    };
    // Local Variables
    // Sub Components
    // Display Widget
    return (
      <DragDropContext onDragEnd={this.doHandleDragItem}>
        {_.map(plan.days, (day) => {
          getDayBlock(day);
        })}
      </DragDropContext>
    );
  }
}

export default withStyles(styles)(PackageSummary);
