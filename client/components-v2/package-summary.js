import _ from 'lodash';
import React, {createElement} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Carousel from 'react-multi-carousel';
import Card from '@material-ui/core/Card';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import HotelIcon from '@material-ui/icons/Hotel';
import CONSTANTS from '../../lib/constants';
// Variables & Functions
const {Color, defaultFont} = CONSTANTS.get().Style;
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
  divFlex: {
    display: 'flex',
  },
  divStyle: {
    margin: 4,
  },
  divDayBlock: {
    padding: '8px 0px',
  },
  divDayTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 4px',
  },
  divDayNo: {
    margin: 'auto',
    font: '600 24px Arial',
  },
  divDate: {
    background: 'lightgray',
    borderRadius: '12px',
    font: '200 12px Arial',
    margin: 'auto 8px',
    padding: '2px 8px',
  },
  divAddHotel: {
    color: Color.default,
    fontSize: 16,
    fontFamily: defaultFont,
    borderRadius: 0,
    padding: 4,
  },
  divHotelBlock: {
    display: 'flex',
    background: Color.default,
    width: 'fit-content',
    color: 'white',
    padding: '4px 8px',
    margin: 4,
    borderRadius: '4px',
  },
  divHotelTitle: {
    fontFamily: defaultFont,
    fontSize: '12px',
    margin: 'auto 4px',
  },
  divDestTitle: {
    fontFamily: defaultFont,
    fontSize: 16,
    padding: '8px 0px',
  },
  divBtnAddDest: {
    margin: 'auto 0px',
    display: 'flex',
    background: 'black',
    color: 'white',
    padding: '4px',
    borderRadius: '8px',
    minHeight: '28px',
    fontFamily: 'arial',
    fontSize: '16px',
  },
  imgCard: {
    overflow: 'hidden',
    margin: 4,
  },
  imgWrapper: {
    height: 0,
    overflow: 'hidden',
    paddingTop: '100%',
    position: 'relative',
  },
  imgItem: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
  },
});
const responsive1 = {
  mobile: {
    breakpoint: {max: 464, min: 0},
    items: 3,
  },
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  display: 'flex',
  userSelect: 'none',
  minHeight: 28,
  padding: '0px 4px',
  margin: '0px 8px 0px 0px',
  borderRadius: '8px',
  fontFamily: defaultFont,
  fontSize: '16px',
  color: 'white',
  background: isDragging ? 'lightgreen' : Color.default,
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: 4,
  minHeight: 36,
  borderRadius: '8px',
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
    this.doHandleRemoveHotel = this.doHandleRemoveHotel.bind(this);
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
  doHandleRemoveHotel(dayNo) {
    console.log('>>>>PackageSummary.doHandleRemoveHotel', dayNo);
    const {actions} = this.props;
    if (actions && actions.handleRemoveHotel) {
      actions.handleRemoveHotel(dayNo);
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
                    <div style={{margin: 'auto'}}>{cc.name}</div>
                    {!(day.dayNo === 1 && index === 0) ? (
                      <div
                        onClick={() => {
                          this.doHandleRemoveCity(day.dayNo, index);
                        }}
                        style={{margin: 'auto', padding: '0px 4px'}}
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
        <div className={classes.divDate}>{curDate.format('DD-MM-YYYY')}</div>
      );
      const divAddHotel = !day.hotel ? (
        <Button
          className={classes.divAddHotel}
          onClick={() => {
            this.doHandleBtnHotel(day.dayNo);
          }}
        >
          <AddIcon fontSize='small' />
          Add Hotel
        </Button>
      ) : (
        ''
      );
      const divHotel = day.hotel ? (
        <div className={classes.divHotelBlock}>
          <HotelIcon styles={{margin: 'auto'}} fontSize='small' />
          <div className={classes.divHotelTitle}>{day.hotel.name}</div>
          <IconButton
            size='small'
            aria-label='Remove Hotel'
            onClick={() => {
              this.doHandleRemoveHotel(day.dayNo);
            }}
          >
            <ClearIcon styles={{margin: 'auto'}} fontSize='small' />
          </IconButton>
        </div>
      ) : (
        ''
      );

      return (
        <div key={`day##${day.dayNo}`} className={classes.divDayBlock}>
          <div className={classes.divDayTitle}>
            <div className={classes.divFlex}>
              <div className={classes.divDayNo}>{`Day ${day.dayNo}`}</div>
              {divDate}
            </div>
            {divAddHotel}
          </div>
          {divHotel}
          <div className={classes.divStyle}>
            <div className={classes.divDestTitle}>Destinations</div>
            <Droppable droppableId={`day##${day.dayNo}`} direction='horizontal'>
              {(provided, snapshot) => (
                <div>
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {getCityItems(day)}
                    <Button
                      onClick={() => {
                        this.doHandleBtnDestination(day.dayNo);
                      }}
                      className={classes.divBtnAddDest}
                    >
                      <AddIcon fontSize='small' />
                      Add
                    </Button>
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
          <div>
            <Carousel
              deviceType={'mobile'}
              itemClass='image-item'
              responsive={responsive1}
            >
              {_.map(day.items, (item) => {
                return (
                  <Card key={item.name} classes={{root: classes.imgCard}}>
                    <div className={classes.imgWrapper}>
                      <img
                        src={item.imgUrl}
                        alt={item.name}
                        className={classes.imgItem}
                        onClick={(e) => {
                          this.doHandleTabSelect(e, day.dayNo);
                        }}
                      />
                    </div>
                  </Card>
                );
              })}
            </Carousel>
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
