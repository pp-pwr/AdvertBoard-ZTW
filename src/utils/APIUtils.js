import { API_BASE_URL, ACCESS_TOKEN } from '../constants'

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json'
    })

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function updateProfile(profileRequest) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.")
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'POST',
        body: JSON.stringify(profileRequest)
    })
}

export function getUserById(userRequest) {
    return request({
        url: API_BASE_URL + "/user/get?profileId=" + userRequest['profileId'],
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function getCategories(categoryRequest) {
    return request({
        url: API_BASE_URL + "/category/all",
        method: 'GET',
        body: JSON.stringify(categoryRequest)
    });
}

export function getAdvertsBySubcategory(subcategoryRequest) {
    const subcategoryName = subcategoryRequest['name']
    const page = subcategoryRequest['page']
    const limit = subcategoryRequest['limit']

    return request({
        url: API_BASE_URL + "/subcategory/get?subcategoryName=" + subcategoryName + "&page=" + page + "&limit=" + limit,
        method: 'GET'
    })
}

export function getUsers(userRequest) {
    const containsString = userRequest['containsString']
    // const page = userRequest['page']
    // const limit = userRequest['limit']

    return request({
        url: API_BASE_URL + "/user/all?nameContains=" + containsString,
        method: 'GET'
    })
}

export function getAdvertsByCategory(categoryRequest) {
    const categoryId = categoryRequest['categoryId']
    const page = categoryRequest['page']
    const limit = categoryRequest['limit']
    const contains = categoryRequest['titleContains']
    const sorting = categoryRequest['sorting']

    let containsString = ""
    let sortString = "&sort=id,desc"

    if(contains.length > 0) {
        containsString = "&titleContains=" + contains
    }

    if(sorting.length > 0) {
        sortString = sorting
    }

    return request({
        url: API_BASE_URL + "/category/get?categoryId=" + categoryId + "&page=" + page + "&limit=" + limit + containsString + sortString,
        method: 'GET'
    })
}

export function getAdverts(advertsRequest) {
    const page = advertsRequest['page']
    const limit = advertsRequest['limit']
    return request({
        url: API_BASE_URL + "/advert/all?page=" + page + "&limit=" + limit,
        method: 'GET'
    })
}

export function getAdvertById(advertRequest) {
    const advert_id = advertRequest['id']
    return request({
        url: API_BASE_URL + "/advert/get?id=" + advert_id,
        method: 'GET'
    })
}

export function addAdvert(advertForm) {
    return request({
        url: API_BASE_URL + "/advert/add",
        method: 'POST',
        body: JSON.stringify(advertForm)
    });
}