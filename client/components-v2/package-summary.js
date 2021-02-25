import _ from 'lodash';
import React, {createElement} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import IconButton from '@material-ui/core/IconButton';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
import HotelIcon from '@material-ui/icons/Hotel';
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
  divFlex: {
    display: 'flex',
  },
  divDayTitle: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  divBtnHotel: {
    padding: 4,
  },
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 4,
  margin: 4,
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
    this.doHandleTabSelect = this.doHandleTabSelect.bind(this);
    this.doHandleBtnHotel = this.doHandleBtnHotel.bind(this);
    // Init data
    // Setup state
  }
  // Event Handlers
  doHandleBtnHotel(dayNo) {
    console.log('>>>>PackageSummary.doHandleBtnHotel', dayNo);
    const {actions} = this.props;
    if (actions && actions.handleBtnHotel) {
      actions.handleBtnHotel(dayNo);
    }
  }
  doHandleDragItem(result) {
    console.log('>>>>PackageSummary.doHandleDragItem', result);
    const {actions} = this.props;
    if (actions && actions.handleDragItem) {
      actions.handleDragItem(result);
    }
  }
  doHandleTabSelect(event, newValue) {
    console.log('>>>>PackageSummary.doHandleTabSelect', newValue);
    const {actions} = this.props;
    if (actions && actions.handleTabSelect) {
      actions.handleTabSelect(event, newValue);
    }
  }
  // Display Widget
  render() {
    const {classes, plan, planExt, reference, actions} = this.props;
    console.log('>>>>PackageSummary, render()', {plan, actions});
    // Local Functions
    const getCityItems = (day) => {
      return (
        <div className={classes.divFlex}>
          {_.map(day.cities, (cc, index) => {
            const uItemId = `item##${day.dayNo}##${cc.destinationId}##${index}`;
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
      return (
        <div key={`day##${day.dayNo}`}>
          <div className={classes.divDayTitle}>
            <div className={classes.divStyle}>{`Day ${day.dayNo}`}</div>
            <IconButton
              onClick={() => {
                this.doHandleBtnHotel(day.dayNo);
              }}
              classes={{root: classes.divBtnHotel}}
            >
              <HotelIcon color='primary' fontSize='default' />
            </IconButton>
          </div>
          <div className={classes.rootGridList}>
            <GridList className={classes.divGridList} cols={3}>
              {_.map(day.items, (item) => {
                return (
                  <GridListTile key={`day##${day.dayNo}##${item.itemId}`}>
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      onClick={(e) => {
                        this.doHandleTabSelect(e, day.dayNo);
                      }}
                    />
                  </GridListTile>
                );
              })}
            </GridList>
          </div>
          <div className={classes.divStyle}>
            <Droppable droppableId={`day##${day.dayNo}`} direction='horizontal'>
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
