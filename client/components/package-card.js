import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconLocationOn from '@material-ui/icons/LocationOn';
import IconChevronRight from '@material-ui/icons/ChevronRight';
import Slider from 'react-slick';

// Variables
const styles = (theme) => ({
  panel: {
    flexGrow: 1,
    paddingTop: 4,
    paddingRight: 4,
    paddingBottom: 4,
    paddingLeft: 4,
  },
  brickBorder: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderColor: 'rgb(214, 217, 218)',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  paper: {
    height: '100%',
    width: '100%',
  },
  sectionImage: {
    height: 200,
    width: '100%',
  },
  sectionContext: {
    height: 150,
    padding: 20,
    backgroundColor: 'white',
  },
  control: {
    padding: 2,
  },
  location: {
    display: 'flex',
  },
  titleProduct: {
    width: '100%',
    fontSize: '100%',
  },
  extendedIcon: {
    marginLeft: 8,
  },
  button: {
    width: '100%',
  },
});

class PackageCard extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleViewPackage = this.doHandleViewPackage.bind(this);
    // Set state
    this.state = {};
  }
  /* ===== Helper Methods ===== */
  /* ===== State & Event Handlers ===== */
  doHandleViewPackage() {
    console.log('>>>>PackageCard.doHandleViewPackage');
    const {handleViewPackage} = this.props;
    if (handleViewPackage) {
      handleViewPackage();
    }
  }
  // Display Widget
  render() {
    // Local Variables
    const {classes, product} = this.props;
    console.log('>>>>PackageCard.render()', product);
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    // Sub Widget
    const itemsSwiper = _.map(product.carouselImageUrls, (img, idx) => {
      // const carouselImage = Helper.resizeImage(img, 'w_788,h_400,c_scale');
      return (
        <div key={`${product.name}_${idx}`}>
          <div onClick={this.doHandleViewPackage}>
            <img
              src={img}
              alt={product.name}
              className={classes.sectionImage}
            />
          </div>
        </div>
      );
    });
    return (
      <div key={product.name} className={classes.panel}>
        <Grid container className={classes.brickBorder} spacing={0}>
          <Grid item xs={12}>
            <Grid container justify='center' spacing={0}>
              <Grid item xs={12}>
                <Slider {...settings}>{itemsSwiper}</Slider>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.location}>
              <div>
                <IconLocationOn />
              </div>
              <div>China</div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.titleProduct}>{product.name}</div>
          </Grid>
          <Grid item xs={12}>
            <div>{product.totalDays} Days From $1000 per person</div>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              size='medium'
              color='primary'
              aria-label='View Details'
              classes={{root: classes.button}}
              onClick={this.doHandleViewPackage}
            >
              View Details
              <IconChevronRight className={classes.extendedIcon} />
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(PackageCard);
