import _ from 'lodash';
import React, {createElement} from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import ItemGrid from '../components-v2/item-grid';
import {withStyles} from '@material-ui/core/styles';

// Variables
const styles = (theme) => ({});

class PopupItem extends React.Component {
  constructor(props) {
    console.log('>>>>PopupItem.constructor', props);
    super(props);
    // Bind handler
    // Set initial state
  }
  // ====== Event Handler ======
  // Render web widget
  render() {
    console.log('>>>>PopupItem.render', this.props);
    // ====== Local Variables ======
    const {dayNo, item, type, reference} = this.props;
    const {handleClose, handleSelectItem} = this.props;
    const itemGrid = {
      itemType: type,
      itemId: type === 'PRODUCT' ? item.productCode : item.seoId,
      imgUrl: item.thumbnailURL,
      pricePlan: item.pricePlan,
      destName: item.primaryDestinationName,
    };
    // ====== Local Functions ======
    // ====== Web Elements ======
    // ====== Display ======
    return (
      <Drawer anchor={'bottom'} open onClose={handleClose}>
        <div>{item.name}</div>
        <div>
          <ItemGrid item={itemGrid} itemExt={item} />
        </div>
        <div>
          <Button
            variant='contained'
            onClick={() => {
              handleSelectItem({item, type, dayNo});
            }}
            color='primary'
            autoFocus
            fullWidth
          >
            Add to my plan
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PopupItem);
