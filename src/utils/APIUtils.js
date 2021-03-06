import { API_BASE_URL, ACCESS_TOKEN } from '../constants'
import { stringToRGB } from './ColorUtils'

const request = (options, content_type=null) => {
    const headers = new Headers()

    if(content_type !== null) {
        headers.append('Content-Type', content_type)
    }

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
    }, 'application/json')
}

export function getUserById(userRequest) {
    console.log(userRequest)
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
    }, 'application/json');
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    }, 'application/json');
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
     const page = userRequest['page']
     const limit = userRequest['limit']

    return request({
        url: API_BASE_URL + "/user/all?nameContains=" + containsString + "&page=" + page + "&limit=" + limit,
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
        url: API_BASE_URL + "/advert/browse?categoryId=" + categoryId + "&page=" + page + "&limit=" + limit + containsString + sortString,
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

export function getRecommendedAdverts(size) {
    return request({
        url: API_BASE_URL + "/advert/recommended?advertCount=" + size,
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

export function getAdvertByAdvertId(id) {
    return request({
        url: API_BASE_URL + "/advert/get?id=" + id,
        method: 'GET'
    })
}

export function getUnsolvedReports(page, limit) {
    return request({
        url: API_BASE_URL + "/admin/report/advert?caseStatus=unsolved&page=" + page + "&limit=" + limit,
        method: 'GET'
    })
}

export function getUnsolvedProfileReports(page, limit) {
    return request({
        url: API_BASE_URL + "/admin/report/profile?caseStatus=unsolved&page=" + page + "&limit=" + limit,
        method: 'GET'
    })
}

export function getBannedAdverts(page, limit) {
    return request({
        url: API_BASE_URL + "/admin/advert/banned?page=" + page + "&limit=" + limit,
        method: 'GET'
    })
}

export function getBannedProfiles(page, limit) {
    return request({
        url: API_BASE_URL + "/admin/profile?role=banned&page=" + page + "&limit=" + limit,
        method: 'GET'
    })
}

export function getUserLastAdverts(userId, limit) {
    return request({
        url: API_BASE_URL + "/advert/last?userId=" + userId + "&limit=" + limit,
        method: 'GET'
    })
}

export function rateProfile(id, rating) {
    const formData = new FormData()
    formData.append('profileId', id)
    formData.append('rating', rating)

    return request({
        url: API_BASE_URL + "/user/rate",
        method: 'POST',
        body: formData
    })
}

export function addAdvert(advertForm) {

    const formData = new FormData()

    for(const [key, value] of Object.entries(advertForm)) {
        formData.append(key, value)
    }

    return request({
        url: API_BASE_URL + "/advert/add",
        method: 'POST',
        body: formData
    });
}

export function setAdvertStatus(id, newStatus) {
    const formData = new FormData()
    formData.append('advertId', id)
    formData.append('status', newStatus)
    return request({
        url: API_BASE_URL + "/admin/advert/status",
        method: 'POST',
        body: formData
    })
}

export function setProfileStatus(id, newStatus) {
    const formData = new FormData()
    formData.append('profileId', id)
    formData.append('role', newStatus)
    return request({
        url: API_BASE_URL + "/admin/user/role",
        method: 'POST',
        body: formData
    })
}


export function setAdvertCaseStatus(id, newCaseStatus) {

    const formData = new FormData()

    formData.append('reportId', id)
    formData.append('status', newCaseStatus)

    return request({
        url: API_BASE_URL + "/admin/report/advert/status",
        method: 'POST',
        body: formData
    })
}

export function setProfileCaseStatus(id, newCaseStatus) {

    const formData = new FormData()

    formData.append('reportId', id)
    formData.append('status', newCaseStatus)

    return request({
        url: API_BASE_URL + "/admin/report/profile/status",
        method: 'POST',
        body: formData
    })
}

export function reportAdvertById(reportRequest) {
    return request({
        url: API_BASE_URL + "/advert/report",
        method: 'POST',
        body: JSON.stringify(reportRequest)
    }, 'application/json')
}

export function reportUserById(reportRequest) {
    return request({
        url: API_BASE_URL + "/user/report",
        method: 'POST',
        body: JSON.stringify(reportRequest)
    }, 'application/json')
}

export function updateAdvert(advertForm) {
    const formData = new FormData()

    for(const [key, value] of Object.entries(advertForm)) {
        formData.append(key, value)
    }

    return request({
        url: API_BASE_URL + "/advert/edit",
        method: 'POST',
        body: formData
    });
}

export function getAdvertImageURL(advertId) {
    return API_BASE_URL + "/advert/image?advertId=" + advertId
}

export function getImage(advertId) {
    return fetch(API_BASE_URL + "/advert/image?advertId=" + advertId, {
        method: 'GET'
    })
    .then(response => response.blob())
    .then(blob => {
            return blob;
    })
}

export function getReportStatistics(year, beginMonth, endMonth) {
    return request({
        url: API_BASE_URL + "/admin/report/stats?year=" + year + "&monthFrom=" + beginMonth + "&monthTo=" + endMonth,
        method: 'GET'
    })
}

export function confirmEmail(confirmToken) {
    const formData = new FormData()

    formData.append('token', confirmToken)

    return request({
        url: API_BASE_URL + "/auth/signupConfirm",
        method: 'POST',
        body: formData
    })
}

export function refreshConfirmToken() {
    return request({
        url: API_BASE_URL + "/user/refreshToken",
        method: 'POST'
    })
}

export function getCategoryLabel(categoryName) {
    if(!categoryName)
        return null

    let size = categoryName.split(" ").length
    let color = stringToRGB(categoryName)

    return 'https://ui-avatars.com/api/?name=' + categoryName + '&length=' + size + '&size=64&font-size=0.45&color=ffffff&bold=true&background=' + color
}