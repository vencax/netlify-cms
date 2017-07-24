import React, { PropTypes } from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import pluralize from "pluralize";
import { IndexLink } from "react-router";
import { IconMenu, Menu, MenuItem } from "react-toolbox/lib/menu";
import Avatar from "react-toolbox/lib/avatar";
import AppBar from "react-toolbox/lib/app_bar";
import FontIcon from "react-toolbox/lib/font_icon";
import FindBar from "../FindBar/FindBar";
import { stringToRGB } from "../../lib/textHelper";
import styles from "./AppHeader.css";
import polyglot from '../../i18n';

export default class AppHeader extends React.Component {

  static propTypes = {
    user: ImmutablePropTypes.map.isRequired,
    collections: ImmutablePropTypes.orderedMap.isRequired,
    runCommand: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    onCreateEntryClick: PropTypes.func.isRequired,
    onLogoutClick: PropTypes.func.isRequired,
  };

  state = {
    createMenuActive: false,
    userMenuActive: false,
  };

  handleCreatePostClick = (collectionName) => {
    const { onCreateEntryClick } = this.props;
    if (onCreateEntryClick) {
      onCreateEntryClick(collectionName);
    }
  };

  handleCreateButtonClick = () => {
    this.setState({
      createMenuActive: true,
    });
  };

  handleCreateMenuHide = () => {
    this.setState({
      createMenuActive: false,
    });
  };

  render() {
    const {
      user,
      collections,
      runCommand,
      toggleDrawer,
      onLogoutClick,
    } = this.props;

    const avatarStyle = {
      backgroundColor: `#${ stringToRGB(user.get("name")) }`,
    };

    return (
      <AppBar
        fixed
        theme={styles}
        leftIcon="menu"
        onLeftIconClick={toggleDrawer}
        onRightIconClick={this.handleRightIconClick}
      >
        <IndexLink to="/" className={styles.homeLink}>
          <FontIcon value="home" className={styles.icon} />
        </IndexLink>
        <IconMenu
          theme={styles}
          icon="add"
          onClick={this.handleCreateButtonClick}
          onHide={this.handleCreateMenuHide}
        >
          {
            collections.filter(collection => collection.get('create')).valueSeq().map(collection =>
              <MenuItem
                key={collection.get("name")}
                value={collection.get("name")}
                onClick={this.handleCreatePostClick.bind(this, collection.get('name'))} // eslint-disable-line
                caption={pluralize(collection.get("label"), 1)}
              />
            )
          }
        </IconMenu>
        <FindBar runCommand={runCommand} />
        <Avatar style={avatarStyle} title={user.get("name")} image={user.get("avatar_url")} />
        <IconMenu icon="settings" position="topRight" theme={styles}>
          <MenuItem onClick={onLogoutClick} value="log out" caption={polyglot.t('logout')} />
        </IconMenu>
      </AppBar>
    );
  }
}
