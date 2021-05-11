import _ from 'lodash';
import React, {createElement} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Button from '@material-ui/core/IconButton';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
import HotelIcon from '@material-ui/icons/Hotel';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
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
    margin: '4px 0px',
  },
  divFlex: {
    display: 'flex',
  },
  divDayTitle: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  divBtnHotel: {
    padding: 0,
  },
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  display: 'flex',
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
  display: 'flex',
});
class PackageSummary extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    this.doHandleDragCity = this.doHandleDragCity.bind(this);
    this.doHandleRemoveCity = this.doHandleRemoveCity.bind(this);
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
  doHandleBtnDestination(dayNo) {
    console.log('>>>>PackageSummary.doHandleBtnDestination', dayNo);
    const {actions} = this.props;
    if (actions && actions.handleBtnDestination) {
      actions.handleBtnDestination(dayNo);
    }
  }
  doHandleDragCity(result) {
    console.log('>>>>PackageSummary.doHandleDragCity', result);
    const {actions} = this.props;
    if (actions && actions.handleDragCity) {
      actions.handleDragCity(result);
    }
  }
  doHandleRemoveCity(dayNo, index) {
    console.log('>>>>PackageSummary.doHandleRemoveCity', {dayNo, index});
    const {actions} = this.props;
    if (actions && actions.handleRemoveCity) {
      actions.handleRemoveCity(dayNo, index);
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
                    <div>{cc.name}</div>
                    {!(day.dayNo === 1 && index === 0) ? (
                      <div
                        onClick={() => {
                          this.doHandleRemoveCity(day.dayNo, index);
                        }}
                        style={{margin: 'auto'}}
                      >
                        <ClearIcon fontSize='small' />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                )}
              </Draggable>
            );
          })}
        </div>
      );
    };
    const getDayBlock = (day, startDate) => {
      // console.log('>>>>DnD.getDayBlock', day);
      const curDate = startDate.clone().add(day.dayNo - 1, 'days');
      const divDate = (
        <div className={classes.divStyle}>{curDate.format('DD-MM-YYYY')}</div>
      );
      const divAddHotel = (
        <Button
          color='primary'
          size='small'
          onClick={() => {
            this.doHandleBtnHotel(day.dayNo);
          }}
        >
          Save
        </Button>
      );
      const divHotel = '';
      return (
        <div key={`day##${day.dayNo}`}>
          <div className={classes.divDayTitle}>
            <div className={classes.divFlex}>
              <div className={classes.divStyle}>{`Day ${day.dayNo}`}</div>
              {divDate}
            </div>
            {divAddHotel}
          </div>
          {divHotel}
          <div className={classes.divStyle}>
            <Droppable droppableId={`day##${day.dayNo}`} direction='horizontal'>
              {(provided, snapshot) => (
                <div>
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {getCityItems(day)}
                    <div style={{margin: 'auto'}} />
                    <div
                      onClick={() => {
                        this.doHandleBtnDestination(day.dayNo);
                      }}
                      style={{margin: 'auto 0'}}
                    >
                      <AddIcon fontSize='small' />
                    </div>
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
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
        </div>
      );
    };
    // Local Variables
    // Sub Components
    // Display Widget
    return (
      <DragDropContext onDragEnd={this.doHandleDragCity}>
        {_.map(plan.days, (day) => {
          return getDayBlock(day, plan.startDate);
        })}
      </DragDropContext>
    );
  }
}

export default withStyles(styles)(PackageSummary);
