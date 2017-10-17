import Firebase from 'firebase';

class ReduxOnFire {
    constructor(config) {
        this.firebaseApp = Firebase.initializeApp(config);
        this.firebaseAuth = Firebase.auth();
        this.firebaseAuthFacebook = new Firebase.auth.FacebookAuthProvider();
        this.firebaseAuthGoogle = new Firebase.auth.GoogleAuthProvider();
        this.firebaseStorage = Firebase.storage();
        this.firebaseDatabase = Firebase.database();
        this.dispatch = null;
        this.getState = null;
    }

    watchAuth() {
        this.firebaseAuth.onAuthStateChanged((result) => {
            if (result) {
                this.dispatch({
                    type: 'USER_LOGGED',
                    result: result
                });
            } else {
                this.dispatch({ type: 'USER_LOGGED_OUT' });
            }
        });
    }

    signup(email, password) {
        this.dispatch({ type: 'SIGNUP_REQUEST' });
        return new Promise((resolve, reject) => {
            this.firebaseAuth.createUserWithEmailAndPassword(email, password)
                .then(result => {
                    this.dispatch({
                        type: 'SIGNUP_SUCCESS',
                        result: result
                    });

                    resolve(result);

                    let user = this.firebaseAuth.currentUser;
                    if (!user.emailVerified) { user.sendEmailVerification(); }
                })
                .catch(error => {
                    this.dispatch({
                        type: 'SIGNUP_FAILED',
                        error: error
                    });

                    reject(error);
                });
        });
    }

    login(email, password) {
        this.dispatch({ type: 'LOGIN_REQUEST' });
        return new Promise((resolve, reject) => {
            this.firebaseAuth.signInWithEmailAndPassword(email, password)
                .then(result => {
                    this.dispatch({
                        type: 'LOGIN_SUCCESS',
                        result: result
                    });

                    resolve(result);
                })
                .catch(error => {
                    this.dispatch({
                        type: 'LOGIN_FAILED',
                        error: error
                    });

                    reject(error);
                });
        });
    }

    passwordReset(email) {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.sendPasswordResetEmail(email)
                .then(() => {
                    this.dispatch({ type: 'PASSWORD_RESET_SUCCESS' });

                    resolve();
                })
                .catch((error) => {
                    this.dispatch({
                        type: 'PASSWORD_RESET_FAILED',
                        error: error
                    });

                    reject(error);
                });
        });
    }

    facebook() {
        this.dispatch({ type: 'LOGIN_REQUEST' });
        return new Promise((resolve, reject) => {
            this.firebaseAuth.signInWithPopup(this.firebaseAuthFacebook)
                .then((result) => {
                    this.dispatch({
                        type: 'LOGIN_SUCCESS',
                        result: result
                    });

                    resolve(result);
                })
                .catch((error) => {
                    this.dispatch({
                        type: 'LOGIN_FAILED',
                        error: error
                    });

                    reject(error);
                });
        });
    }

    google() {
        this.dispatch({ type: 'LOGIN_REQUEST' });
        return new Promise((resolve, reject) => {
            this.firebaseAuth.signInWithPopup(this.firebaseAuthGoogle)
                .then((result) => {
                    this.dispatch({
                        type: 'LOGIN_SUCCESS',
                        result: result
                    });

                    resolve(result);
                })
                .catch((error) => {
                    this.dispatch({
                        type: 'LOGIN_FAILED',
                        error: error
                    });

                    reject(error);
                });
        });
    }

    logout() {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.signOut()
                .then(() => {
                    this.dispatch({ type: 'LOGOUT_SUCCESS' });

                    resolve();
                })
                .catch((error) => {
                    this.dispatch({
                        type: 'LOGOUT_FAILED',
                        error: error
                    });

                    reject(error);
                });
        });
    }

    watchRecords(recordsName, returnId, reverse) {
        let actionName = recordsName.toUpperCase();
        this.dispatch({ type: 'GET_' + actionName + '_REQUEST' });
        this.firebaseDatabase.ref(recordsName).on('value',
            (result) => {
                let array = result.val();
                if (returnId) {
                    array = [];
                    result.forEach((child) => {
                        let element = child.val();
                        element.id = child.key;
                        array.push(element);
                    });
                }

                this.dispatch({
                    type: 'GET_' + actionName + '_SUCCESS',
                    [recordsName]: reverse ? array.reverse() : array
                });
            },
            (error) => {
                this.dispatch({
                    type: 'GET_' + actionName + '_FAILED',
                    error: error
                });
            }
        );
    }

    watchRecordsOrdered(recordsName, returnId, criteria, reverse) {
        let actionName = recordsName.toUpperCase();
        this.dispatch({ type: 'GET_' + actionName + '_REQUEST' });
        this.firebaseDatabase.ref(recordsName).orderByChild(criteria).on('value',
            (result) => {
                let array = result.val();
                if (returnId) {
                    array = [];
                    result.forEach((child) => {
                        let element = child.val();
                        element.id = child.key;
                        array.push(element);
                    });
                }

                this.dispatch({
                    type: 'GET_' + actionName + '_SUCCESS',
                    [recordsName]: reverse ? array.reverse() : array
                });
            },
            (error) => {
                this.dispatch({
                    type: 'GET_' + actionName + '_FAILED',
                    error: error
                });
            }
        );
    }

    getRecordsFiltered(recordsName, filter) {
        let actionName = recordsName.toUpperCase();
        this.dispatch({ type: 'GET_' + actionName + '_FILTERED_REQUEST' });
        this.firebaseDatabase.ref(recordsName).once('value',
            (result) => {
                let array = [];
                result.forEach((child) => {
                    let element = child.val();
                    element.id = child.key;
                    array.push(element);
                });
                this.dispatch({
                    type: 'GET_' + actionName + '_FILTERED_SUCCESS',
                    [recordsName]: filter(array)
                });
            },
            (error) => {
                this.dispatch({
                    type: 'GET_' + actionName + '_FILTERED_FAILED',
                    error: error
                });
            }
        );
    }

    getRecordById(recordName, recordId) {
        let actionName = recordName.toUpperCase();
        this.dispatch({ type: 'GET_SINGLE_' + actionName + '_REQUEST' });

        if (this.getState()[recordName]) {
            var record = this.getState()[recordName].all.filter(value => {
                return value.id == recordId ? true : false
            });
        }

        if (record && record[0]) {
            this.dispatch({
                type: 'GET_SINGLE_' + actionName + '_CACHED',
                [recordName]: record[0]
            });
        } else {
            this.firebaseDatabase.ref(recordName).child(recordId).once('value',
            (result) => {
                this.dispatch({
                    type: 'GET_SINGLE_' + actionName + '_SUCCESS',
                    [recordName]: result.val()
                });
            },
            (error) => {
                this.dispatch({ type: 'GET_SINGLE_' + actionName + '_FAILED' });
            });
        }
    }

    getRecordByContent(recordName, recordContent) {
        let actionName = recordName.toUpperCase();
        return {
            type: 'GET_' + actionName,
            [recordName]: recordContent
        }
    }

    addRecord(recordName, recordContent) {
        let actionName = recordName.toUpperCase();
        this.dispatch({ type: 'ADD_' + actionName + '_REQUEST' });
        let reference = this.firebaseDatabase.ref().child(recordName).push().key;
        return new Promise((resolve, reject) => {
            this.firebaseDatabase.ref().child(recordName + '/' + reference).update(
                recordContent,
                (error) => {
                    if (error) {
                        this.dispatch({
                            type: 'ADD_' + actionName + '_FAILED'
                        });

                        reject(error);
                    } else {
                        this.dispatch({
                            type: 'ADD_' + actionName + '_SUCCESS',
                            reference: reference
                        });

                        resolve(reference);
                    }
                }
            );
        });
    }

    uploadFile(recordName, filesArray) {
        let actionName = recordName.toUpperCase();
        this.dispatch({ type: 'UPLOAD_' + actionName + '_REQUEST' });
        let fileUploadCycle = filesArray.map((file) => {
            return new Promise((resolve, reject) => {
                this.firebaseStorage.ref().child(recordName + '/' + file.name).put(file)
                    .then((result) => {
                        this.dispatch({
                            type: 'UPLOAD_' + actionName + '_SUCCESS',
                        });

                        resolve(result.downloadURL);
                    })
                    .catch((error) => {
                        this.dispatch({
                            type: 'UPLOAD_' + actionName + '_FAILED',
                            error: error
                        });

                        reject(error);
                    });
            });
        });

        return Promise.all(fileUploadCycle)
    }

    deleteFile(recordName, fileRef) {
        let actionName = recordName.toUpperCase();
        this.dispatch({ type: 'DELETE_' + actionName + '_REQUEST' });

        this.firebaseStorage.ref().child(recordName + '/' + fileRef).delete()
            .then((result) => {
                this.dispatch({
                    type: 'DELETE_' + actionName + '_SUCCESS',
                });
            })
            .catch((error) => {
                this.dispatch({
                    type: 'DELETE_' + actionName + '_FAILED',
                    error: error
                });
            });
    }

    updateRecord(recordName, recordId, recordContent) {
        let actionName = recordName.toUpperCase();
        this.dispatch({type: 'UPDATE_' + actionName + '_REQUEST'});
        return new Promise((resolve, reject) => {
            if (recordId == null) {
                var reference = this.firebaseDatabase.ref().child(recordName);
            } else {
                var reference = this.firebaseDatabase.ref().child(recordName + '/' + recordId);
            }

            return reference.update(recordContent,
                (error) => {
                    if (error) {
                        this.dispatch({
                            type: 'UPDATE_' + actionName + '_FAILED',
                            error: error
                        });

                        reject(error);
                    } else {
                        this.dispatch({
                            type: 'UPDATE_' + actionName + '_SUCCESS',
                            [recordName]: recordContent
                        });

                        resolve(recordContent);
                    }
                }
            );
        });
    }

    setRecord(recordName, recordContent) {
        let actionName = recordName.toUpperCase();
        this.dispatch({type: 'SET_' + actionName + '_REQUEST'});
        return new Promise((resolve, reject) => {
            let reference = this.firebaseDatabase.ref().child(recordName);
            return reference.set(
                recordContent,
                (error) => {
                    if (error) {
                        this.dispatch({
                            type: 'SET_' + actionName + '_FAILED'
                        });

                        reject(error);
                    } else {
                        this.dispatch({
                            type: 'SET_' + actionName + '_SUCCESS',
                            [recordName]: recordContent
                        });

                        resolve(recordContent)
                    }
                }
            );
        });
    }

    deleteRecord(recordName, recordId) {
        let actionName = recordName.toUpperCase();
        this.firebaseDatabase.ref().child(recordName + '/' + recordId).remove();
        return {
            type: 'DELETE_' + actionName,
            id: recordId
        }
    }

    addNotification(notification) {
        const newNotification = Object.assign({}, notification);
        newNotification.id = new Date().getTime();
        this.dispatch({
            type: 'ADD_NOTIFICATION',
            notification: newNotification
        });

        if (newNotification.removeAfter) {
            setTimeout(() => {
                this.dispatch({
                    type: 'REMOVE_NOTIFICATION',
                    id: newNotification.id,
                });
            }, newNotification.removeAfter);
        }
    }

    removeNotification(id) {
        this.dispatch({
            type: 'REMOVE_NOTIFICATION',
            id: id
        });
    }

    clearNotifications() {
        this.dispatch({
            type: 'CLEAR_NOTIFICATIONS'
        });
    }

}

export default ReduxOnFire;
