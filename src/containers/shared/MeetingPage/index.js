import React, { Component } from "react";
import { Text, View, ScrollView, Image, AsyncStorage, ActivityIndicator } from "react-native";
import {
  Header,
  TabbedMenu,
  Card,
  ListItem,
  Video,
  Map,
  ModalScreen
} from "../../../components";
import { connect } from "react-redux";
import PageStyle from "./styles";
import { DrawerActions } from "react-navigation";
import {
  fetchMainMeeting,
  fetchMainVenue,
  fetchFacilitators
} from "../../../actions";

class MeetingPage extends Component {

  state = {
    modalVisible: false,
    selectedIndex: 1
  };

  componentDidMount() {
    const { navigation, status, token } = this.props;
    const id = navigation.getParam("meetingId");
    if (status === "loggedin") {
      this.props.fetchMainMeeting(35, status, token);
      this.props.fetchMainVenue(35, status, token);
      this.props.fetchExpectations(35, status, token);
      this.props.fetchFacilitators(35, status, token);
    } else {
      this.props.fetchMainMeeting(id, "loggedout", null);
      this.props.fetchFacilitators(id, "loggedout", null);
    }
  }


  renderTitle() {
    const { mainmeeting } = this.props;
    return (
      <Card>
        {this.renderMeetingPicture(mainmeeting.venues)}
        <View style={PageStyle.info}>
          <Text style={PageStyle.description}>{mainmeeting.title}</Text>
          <Text style={PageStyle.date}>{mainmeeting.date}</Text>
          <Text style={PageStyle.area}> { this.renderVenue(mainmeeting.venues) }</Text>
        </View>
      </Card>
    );
  }

  renderVenue(venues) {
    const venue = venues.map(({ id, title }) => {
      return <Text key={id}> {title} </Text>;
    });

    return venue;
  }

  renderMeetingPicture(venues) {
    const venue = venues.map(({ image, id }) => {
      return <Image key={id} style={PageStyle.image} source={image} />;
    });

    return venue;
  }

  renderVideo() {
    const { mainmeeting } = this.props;
    return (
      <Card>
        <Video videoSource={mainmeeting.video} />
      </Card>
    );
  }

  renderDescription() {
    const { mainmeeting } = this.props;
    return (
      <Card>
        <View style={PageStyle.textArea}>
          <Text style={PageStyle.text}>{mainmeeting.description}</Text>
        </View>
      </Card>
    );
  }

  renderExpectations() {
    const { mainmeeting } = this.props;
    const expectation = mainmeeting.expectations.map(
      ({ id, image, title, description }) => {
        return (
          <View key={id} style={PageStyle.expectationContainer}>
            <View style={PageStyle.expectationList}>
              <View style={{ width: "25%" }}>
                <Image
                  style={PageStyle.expectationIcon}
                  source={{ uri: image.url }}
                />
              </View>
              <View style={{ width: "75%" }}>
                <Text style={PageStyle.expectationTitle}>{title}</Text>
                <Text style={PageStyle.expectationDescription}>
                  {description}
                </Text>
              </View>
            </View>
            <View style={PageStyle.expectationBorder} />
          </View>
        );
      }
    );

    return expectation;
  }

  toggleModal() {
    this.setState({ modalVisible: true });
  }

  getIndex(id) {
    const { facilitators } = this.props;
    return facilitators.findIndex(facilitators => facilitators.id === id);
  }

  renderFacilitators() {
    const { facilitators } = this.props;
    if (facilitators.length > 0) {
      const facilitator = facilitators.map(
        ({ id, first_name, last_name, position }) => {
          return (
            <View key={id} style={PageStyle.expectationContainer}>
              <ListItem
                onPress={() => {
                  this.setState(
                    {
                      selectedIndex: this.getIndex(id)
                    },
                    () => {
                      this.toggleModal();
                    }
                  );
                }}
              >
                <View style={PageStyle.expectationList}>
                  <View style={{ width: "25%" }}>
                    <Image
                      style={[PageStyle.expectationIcon, PageStyle.profileIcon]}
                      source={{
                        uri:
                          "https://cdn5.vectorstock.com/i/thumb-large/13/04/male-profile-picture-vector-2041304.jpg"
                      }}
                    />
                  </View>
                  <View style={{ width: "75%" }}>
                    <Text style={PageStyle.expectationTitle}>
                      {first_name} {last_name}
                    </Text>
                    <Text style={PageStyle.expectationDescription}>
                      {position}
                    </Text>
                  </View>
                </View>
                <View style={PageStyle.expectationBorder} />
              </ListItem>
              <ModalScreen
                facilitator={facilitators[this.getIndex(id)]}
                modalVisible={this.state.modalVisible}
              />
            </View>
          );
        }
      );

      return facilitator;
    }
  }

  renderMap(venues) {
    const venue = venues.map(({ title, latitude, longitude, id }) => {
      return (
        <Map key={id} latitude={latitude} longitude={longitude} title={title} />
      );
    });

    return venue;
  }

  renderDetails() {
    const { navigation, mainmeeting } = this.props;
    const status = navigation.getParam("status");

    if (status !== "loggedin")
      return (
        <View>
          <Text style={PageStyle.header}> FACILITATORS </Text>
          {this.renderFacilitators()}
          <Text style={[PageStyle.header, PageStyle.mapContainer]}>VENUE</Text>
          {/* For refactoring, must be inside Card */}
          <View style={PageStyle.mapContainer} />
          <Card>{this.renderMap(mainmeeting.venues)}</Card>
        </View>
      );
  }

  hasFetchedAll() {
    const { hasLoadedMainMeeting, hasLoadedFacilitators } = this.props;

    return (
      hasLoadedMainMeeting && hasLoadedFacilitators
    );
  }

  render() {
    const { navigation, hasLoadedMainMeeting, hasLoadedFacilitators, token } = this.props;
    const status = navigation.getParam("status");
    return (
      <View style={PageStyle.container}>
        <Header
          label="MEETING DETAILS"
          status={status}
          settings={() =>
            navigation.navigate("SettingsPage", {
              content: "settings",
              previousRoute: "MeetingLoginPage"
            })
          }
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
        {this.hasFetchedAll() ?
          <ScrollView>
            <Image
              style={PageStyle.backgroundImage}
              source={require("../../../assets/event.png")}
            />
            <View style={PageStyle.overlapCardContainer}>
              {this.renderTitle()}
              {this.renderVideo()}
              <Text style={PageStyle.header}> OUR UNIQUE FORMAT </Text>
              {this.renderDescription()}
              <Text style={PageStyle.header}> WHAT TO EXPECT </Text>
              {this.renderExpectations()}
              {this.renderDetails()}
            </View>
          </ScrollView> :
          <View style={PageStyle.loading}>
            <ActivityIndicator loaded={this.hasFetchedAll()} size="large" />
          </View>
        }

        <TabbedMenu status={status} navigation={navigation} />
      </View >
    );
  }
}

const mapStatetoProps = ({ meetingsState, auth }) => {
  const { mainmeeting, expectations, facilitators,
    hasLoadedMainMeeting, hasLoadedFacilitators
  } = meetingsState;

  const { status, token } = auth;
  return {
    mainmeeting, expectations, facilitators,
    hasLoadedMainMeeting, hasLoadedFacilitators, status, token
  };
};
export default connect(
  mapStatetoProps,
  { fetchMainMeeting, fetchFacilitators }
)(MeetingPage);
