import React, { Component } from 'react';
import CenterSlider from './CenterSlider.js'
import PackageSummary from './PackageSummary.js'
import {Panel, Tab, NavBarItem} from 'react-weui';
import Collapsible from 'react-collapsible';
import _ from 'lodash';


class App extends Component {

  constructor(props) {
    super(props);
    console.log('>>>>print props', props);

    if(props.packageInstId) {
      this.state = {
        packageInst: {
          id: 1,
          name: "China 5 Days",
          desc: "Let’s finish this lovely situation by handling the route/controller for where the server pushes this code",
          days: 2,
          isPromoted: true,
          isActive: true,
          imageUrl: "package_1.png",
          items: [
            {
              id: 1,
              dayNo: 1,
              order: 1,
              desc: "Day tour in Shanghai",
              attractionId: 101,
              attractionName: "Shanghai 1",
              attractionDesc: "Shanghai 1",
              attractionImageUrl: "attraction_1.png",
              attractionCity: "Shanghai",
            },
            {
              id: 2,
              dayNo: 1,
              order: 2,
              desc: "Night tour in Shanghai",
              attractionId: 102,
              attractionName: "Shanghai 2",
              attractionDesc: "Shanghai 2",
              attractionImageUrl: "attraction_2.png",
              attractionCity: "Shanghai",
            },
            {
              id: 3,
              dayNo: 2,
              order: 1,
              desc: "Day tour in Beijing",
              attractionId: 103,
              attractionName: "Beijing 1",
              attractionDesc: "Beijing 1",
              attractionImageUrl: "attraction_1.png",
              attractionCity: "Beijing",
            },
            {
              id: 4,
              dayNo: 2,
              order: 2,
              desc: "Night tour in Beijing",
              attractionId: 104,
              attractionName: "Beijing 2",
              attractionDesc: "Beijing 2",
              attractionImageUrl: "attraction_2.png",
              attractionCity: "Beijing",
            },
          ],
          ratePlan: [
            {
              id: 1,
              tier: 1,
              premiumFee: 500,
              minJoins: 8,
              packageRate: 2000,
            },
            {
              id: 2,
              tier: 2,
              premiumFee: 300,
              minJoins: 16,
              packageRate: 1200,
            },
          ],
        },
        packages: [],
      };
    } else {
      this.state = {
        packageInst: null,
        packages: [
          {
            id: 1,
            name: "China 2 Days",
            desc: "Let’s finish this lovely situation by handling the route/controller for where the server pushes this code",
            days: 2,
            isPromoted: true,
            isActive: true,
            imageUrl: "package_1.png",
          },
          {
            id: 2,
            name: "Another China 2 Days",
            desc: "Let’s finish this lovely situation by handling the route/controller for where the server pushes this code",
            days: 2,
            isPromoted: true,
            isActive: true,
            imageUrl: "package_2.png",
          },
        ],
      };
    }
    console.log('>>>>print state', this.state);
  }

  render() {
    console.log('>>>>print state', this.state);
    const {packages, packageInst} = this.state;

    let page;

    if(packageInst) {
      let cityMap = _.groupBy(packageInst.items, function(item){return item.attractionCity});;
      console.log('>>>>', cityMap);

      const cityCollapsible = _.keys(cityMap).map((city, idx) => {
        let setting = {
          key: idx,
          trigger: city,
          open: true
        };

        let items = cityMap[city].map((item) => {
          return {
            id: item.id,
            name: item.attractionName,
            desc: item.desc,
            imageUrl: item.attractionImageUrl
          };
        });

        return (
          <Collapsible {...setting} >
            <CenterSlider
              items={items}
              buttonName="Like"
            >
            </CenterSlider>
          </Collapsible>
        );
      });

      page = (
        <div className="App">
          <section>
          <Tab type="navbar">
            <NavBarItem label="Package">
              <section id='package'>
                <PackageSummary
                  packageInst={packageInst}
                />
                <Panel>
                  <section id='attractions'>
                    {cityCollapsible}
                  </section>
                </Panel>
              </section>
            </NavBarItem>
            <NavBarItem label="Summary">
              <p>Tab Summary</p>
            </NavBarItem>
          </Tab>
          </section>
        </div>
      );
    } else {
      page = (
        <div className="App">
          <section>
            <CenterSlider
              items={packages}
              buttonName="Book Now"
            >
            </CenterSlider>
          </section>
        </div>
      );
    }
    return page;
  }
}

export default App;

/*

*/
