import React, { Component } from 'react'
import LoadingIndicator from '../../../../common/LoadingIndicator';
import { getUsers } from '../../../../utils/APIUtils'
import Alert from 'react-s-alert'
import bike from '../../../../assets/images/bike.jpg'
import profile_pic from '../../../../assets/images/account.png'
import styled from 'styled-components'
import PageSelectionPanel from "../../../advert/filters/PageSelectionPanel"


const ProfileContainer = styled.div`
    text-align: center;
    width: 100%;
    height: 100%;
    display: flex-inline;
    margin: auto;

    & > .userlist-content {
        background: #fff;
        width: 100%;
        text-align: center;
        display: flex;
        flex: justify;
        flex-wrap: wrap;
        border-radius: 2px;
        margin-top: 30px;
        vertical-align: center;
        position: relative;    
        padding: 35px;
    }
`

const ProfileListEntry = styled.div`
    box-shadow: 0 1px 11px rgba(0, 0, 0, 0.05);
    height: 120px;
    width: 28%;
    max-width: 28%;
    margin-left: 2rem;
    margin-right: 2rem;
    position: relative;
    margin-top: 2rem;
    display: flex;
    flex: wrap;
    align-items: center;
    flex-grow: 1;
    text-align: center;

    border-radius: 75px 25px 25px 75px;

    margin-top: 3.5rem;

    &:hover {
        box-shadow: 0 1px 24px lightblue;
    }

    & > img {
        width: auto;
        height: 150px;
        position: absolute;
        left: 0px;
    }

    & > .userlist-element-info {
        text-align: left;
        display: flex;
        flex: wrap;
        margin-left: 180px;
        position: absolute;
        font-size: 1.2em;
        overflow: hidden;   
        text-align: left;
    }
`

class ProfileCell extends Component {
    redirectToPage = (e) => {
        e.preventDefault()
        this.props.onUserClick(this.props.profile.id)
    }

    render() {
        const profile = this.props.profile
        return (
            <ProfileListEntry onClick={this.redirectToPage}>
                <img src={profile_pic} alt="ProfileImage" className="profile-image" />
                <p className="userlist-element-info">
                    <b>{profile.visibleName}</b>
                </p>
            </ProfileListEntry>
        )
    }
}

class ProfileList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            filter: "",
            userList: [],
            limit: 9,
            pageCount: 0
        }

        this.mounted = false
        this.showProfile = this.showProfile.bind(this)
        this.pageChange = this.pageChange.bind(this)
    }

    componentDidMount() {
        this.mounted = true
        this.updateUserList()
    } 

    componentWillUnmount() {
        this.mounted = false
    }

    updateUserList = (page) => {
        const userRequest = {
            containsString: this.state.filter,
            page: page,
            limit: this.state.limit
        }
        getUsers(userRequest).then(response => {
            if(this.mounted) {
                this.setState({
                    userList: response['content'],
                    pageCount: response['totalPages']
                }, () => {
                    console.log(this.state)
                })
            }
        }).catch(error => {
            Alert.error((error && error.message) || "Ups! Coś poszło nie tak!")
        })
    }

    handleInputChange = (event) => {
        const target = event.target;
        const inputValue = target.value;

        this.setState({
            filter: inputValue
        }) 
    }

    showProfile(id) {
        this.props.history.push({
            pathname: '/profile/user/' + id
          })
    }

    renderUserCells() {
        const user_cells = []

        if(this.state.userList) {
            for(let i = 0; i < this.state.userList.length; i++) {
                let user_profile = this.state.userList[i]

                user_cells.push(
                    <ProfileCell 
                        key={user_profile.id} 
                        profile={user_profile} 
                        history={this.props.history}
                        onUserClick={this.showProfile}/>
                )
            }
        }

        return user_cells
    }

    pageChange(newPage) {
        this.updateUserList(newPage)
    }

    render() {
        if(!this.mounted) {
            return <LoadingIndicator />
        }

        return (
            <ProfileContainer>
            <div className="userlist-search">
                <input className="search-box-field" type="text" name="currentUserFilter"
                                onChange={this.handleInputChange}/>
                <button className="btn btn-primary" onClick={this.updateUserList}>Filtruj</button>
            </div>

            <div className="userlist-content">
                { this.renderUserCells() }
            </div>

            <PageSelectionPanel className='page-selection' pages={this.state.pageCount} changeHandler={this.pageChange}/>
            </ProfileContainer>
        )
    }
}

export default ProfileList