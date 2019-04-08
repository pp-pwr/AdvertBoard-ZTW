import React, {Component} from "react"
import {getCategories, addAdvert } from "../utils/APIUtils"
import Alert from 'react-s-alert'
import FileBase64 from 'react-file-base64'
import ReactSearchBox from 'react-search-box'
import LoadingIndicator from "../common/LoadingIndicator";
import AdditionalInfo from './AdditionalInfo'
import { Table } from 'react-bootstrap'


export function setCategory(categoryId) {
    if(this !== undefined) {
        this.setState({
            advertInfo: {
                ...this.state.advertInfo,
                selectedCat: categoryId
            },
            advert_id: null
        })
    }
}

class AdvertForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            advertInfo: {
                title: '',
                tags: '',
                description: '',
                image: '',
                fileName: '',
                infos: {},
                selectedCat: props.advert_id
            },
            categoryList: [],
            currentCategory: null,
            mounted: false
        }

        this.categories = []
        console.log(this.state.advertInfo.selectedCat)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    addChilds(categoryList) {
        if (!categoryList || categoryList.length < 1)
            return

        for(let i = 0; i < categoryList.length; i++) {
            let category = categoryList[i]
            this.categories.push({
                key: category['id'],
                value: category['name'],
                infos: category['infoList']
            })
            this.addChilds(category['subcategories'])
        }
    }

    componentDidMount() {
        getCategories().then(response => {
                const categoryTree = response
                this.categories = []
                this.addChilds(categoryTree['subcategories'])

                this.setState({
                    categoryList: this.categories,
                    mounted: true
                });
            }
        ).catch(error => {
            console.log("error: " + error);
        });

    }

    handleInputChange = (event) => {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({ 
            advertInfo: {
                ...this.state.advertInfo,
                [inputName]: inputValue
            }})
    };

    loadFiles(file) {
        let base64_string = JSON.stringify(file.base64).substring(23)
        this.setState({
            advertInfo: {
                ...this.state.advertInfo,
                image: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    base64: base64_string
                }
            }
        })
    }

    handleInfoChange = (event) => {
        const target = event.target;
        const inputName = "" + target.name
        const inputValue = target.value;    

        this.setState({
            advertInfo: {
                ...this.state.advertInfo,
                infos: {
                    ...this.state.advertInfo.infos,
                    [inputName]: inputValue
                }
            }
        })
    }

    handleCatChange(selectedCatId) {
        let category = null
        let curr_cat = null
        for(let i = 0; i < this.categories.length; i++) {
            curr_cat = this.categories[i]
            if(curr_cat.key === selectedCatId) {
                category = curr_cat
            }
        }

        this.setState({
            advertInfo: {
                ...this.state.advertInfo,
                selectedCat: selectedCatId
            },
            currentCategory: category
        })
    }

    handleSubmit(event) {
        event.preventDefault();

        console.log("state")
        console.log(this.state)
        if(this.state.advertInfo.title.length > 0 && this.state.advertInfo.description.length > 0 
            && this.state.advertInfo.selectedCat) {

            const advertInfo = {
                "title": this.state.advertInfo.title,
                "description": this.state.advertInfo.description,
                "tags": this.state.advertInfo.tags.split(/(\s+)/).filter( e => e.trim().length > 0),
                "category": this.state.advertInfo.selectedCat,
                "image": this.state.advertInfo.image,
                "additionalInfo": this.state.advertInfo.infos
            }

            console.log("This is what we send")
            console.log(advertInfo)
            if(!this.state.advert_id) {
            addAdvert(advertInfo)
                .then(response => {
                    Alert.success("Pomyślnie dodano ogłoszenie!")
                    this.props.history.push("/")
                }).catch(error => {
                Alert.error((error && error.message) || "Coś poszło nie tak! Spróbuj ponownie lub skontaktuj się z administratorem!")
                })
            } else {
                advertInfo.push({ "id": this.state.advert_id })

            }
        } else {
            Alert.error("Musisz podać nazwę, opis oraz podkategorię!")
        }
    }

    render() {
        if(!this.state.mounted)
            return <LoadingIndicator/>

        return (
            <div className="add-advert-container">
                <div className="add-advert-content-whole">
                    <form className="add-advert-content" onSubmit={this.handleSubmit}>
                        <h3>Dodaj ogłoszenie</h3>
                        <div>
                            <input className="add-advert-item" type="text" name="title" placeholder="Tytuł"
                                value={this.state.advertInfo.title} onChange={this.handleInputChange} required/>
                            <br/>
                            <textarea className="add-advert-item" rows={5} name="description" placeholder="Opis"
                                    value={this.state.advertInfo.description} onChange={this.handleInputChange} required/>
                            <br/>
                            <input className="add-advert-item" type="text" name="tags" placeholder="Tagi"
                                value={this.state.advertInfo.tags} onChange={this.handleInputChange} />
                            <br/>
                            {/* <input className="add-advert-item" type="file" name="image" size="50"
                                value={this.state.advertInfo.fileName ? this.state.advertInfo.fileName : ""} onChange={this.handleFileChange}/> */}
                            <FileBase64 className="add-advert-item" multiple={false} onDone={this.loadFiles.bind(this)} />
                            <br/>
                        </div>
                        
                        <ReactSearchBox data={this.categories} onSelect={record => this.handleCatChange(record['key'])}/>

                        <div className="add-advert-item">
                            <button type="submit" 
                                disabled={this.state.advertInfo.selectedCat == null } 
                                className={`btn btn-block btn-primary`} 
                                onClick={ this.handleSubmit }>Dodaj ogłoszenie</button>
                        </div>

                    </form>
                    <div className="add-advert-additional-info">
                        <AdditionalInfo infos={ this.state.currentCategory } infoChangeHandler={this.handleInfoChange}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdvertForm