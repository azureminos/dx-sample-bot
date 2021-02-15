import _ from 'lodash';
import React, {createElement} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables & Functions
const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  rootGridList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    maxHeight: '120px',
  },
  divGridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  divStyle: {
    marginTop: 4,
    marginBottom: 4,
  },
  divCities: {
    display: 'flex',
  },
});
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'lightgreen' : 'grey',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: 0,
  minHeight: 16,
  width: '100%',
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
    const getCityItems = (day) => {
      return (
        <div className={classes.divCities}>
          {_.map(day.cities, (cc, index) => {
            const uItemId = `item##${day.dayNo}##${cc.destinationId}`;
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
                    {cc.name}
                  </div>
                )}
              </Draggable>
            );
          })}
        </div>
      );
    };
    const getDayBlock = (day) => {
      // console.log('>>>>DnD.getDayBlock', day);
      let sCities = '';
      for (let i = 0; day.cities && i < day.cities.length; i++) {
        const c = day.cities[i];
        sCities = `${sCities}${c.name}, `;
      }
      sCities = sCities ? sCities.substring(0, sCities.length - 2) : '';
      return (
        <div key={`day##${day.dayNo}`}>
          <div className={classes.divStyle}>{`Day ${day.dayNo}`}</div>
          <div className={classes.rootGridList}>
            <GridList className={classes.divGridList} cols={3}>
              {_.map(day.items, (item) => {
                return (
                  <GridListTile key={`day##${day.dayNo}##${item.itemId}`}>
                    <img src={item.imgUrl} alt={item.name} />
                  </GridListTile>
                );
              })}
            </GridList>
          </div>
          <div className={classes.divStyle}>
            <Droppable droppableId={`day##${day.dayNo}`}>
              {(provided, snapshot) => (
                <div>
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {getCityItems(day)}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </div>
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
