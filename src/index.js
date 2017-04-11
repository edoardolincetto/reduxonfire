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
        return new Promise((resolve) => {
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
                });
        });
    }

    login(email, password) {
        this.dispatch({ type: 'LOGIN_REQUEST' });
        this.firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(result => {
                this.dispatch({
                    type: 'LOGIN_SUCCESS',
                    result: result
                });
            })
            .catch(error => {
                this.dispatch({
                    type: 'LOGIN_FAILED',
                    error: error
                });
            });
    }

    passwordReset(email) {
        this.firebaseAuth.sendPasswordResetEmail(email)
            .then(() => {
                this.dispatch({ type: 'PASSWORD_RESET_SUCCESS' });
            })
            .catch((error) => {
                this.dispatch({
                    type: 'PASSWORD_RESET_FAILED',
                    error: error
                });
            });
    }

    facebook() {
        this.dispatch({ type: 'LOGIN_REQUEST' });
        return new Promise((resolve) => {
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
                });
        });
    }

    google() {
        this.dispatch({ type: 'LOGIN_REQUEST' });
        return new Promise((resolve) => {
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
                });
        });
    }

    logout() {
        this.firebaseAuth.signOut()
            .then(() => {
                this.dispatch({ type: 'LOGOUT_SUCCESS' });
            })
            .catch((error) => {
                this.dispatch({
                    type: 'LOGOUT_FAILED',
                    error: error
                });
            });
    }

    getRecord(actionName, recordName) {
        var actionName = actionName.toUpperCase();
        this.dispatch({type: 'GET_' + actionName + '_REQUEST'});

        this.firebaseDatabase.ref(recordName).on('value',
        (snapshot) => {
            this.dispatch({
                type: 'GET_' + actionName + '_SUCCESS',
                [recordName]: snapshot.val()
            });
        },
        (error) => {
            this.dispatch({type: 'GET_' + actionName + '_FAILED'});
        });
    }

    getRecordById(recordName, recordId) {
        var actionName = recordName.toUpperCase();
        this.dispatch({type: 'GET_' + actionName + '_REQUEST'});

        const record = this.getState()[recordName].all.filter(value => {
            return value.id == recordId ? true : false
        });

        if(record.length == 1) {
            this.dispatch({
                type: 'GET_' + actionName + '_CACHED',
                [recordName]: record[0]
            });
        } else {
            this.firebaseDatabase.ref(recordName).child(recordId).on('value',
            (snapshot) => {
                this.dispatch({
                    type: 'GET_' + actionName,
                    [recordName]: snapshot.val()
                });
            },
            (error) => {
                this.dispatch({type: 'GET_' + actionName + '_FAILED'});
            });
        }
    }

    getRecordByContent(recordName, recordContent) {
        var actionName = recordName.toUpperCase();
        return {
            type: 'GET_' + actionName,
            [recordName]: recordContent
        }
    }

    getRecords(recordsName) {
        var actionName = recordsName.toUpperCase();
        this.dispatch({type: 'GET_' + actionName + '_REQUEST'});
        this.firebaseDatabase.ref(recordsName).on('value',
        (snapshot) => {
            var array = [];
            snapshot.forEach((child) => {
                var finalObject = child.val();
                if (finalObject.id) {
                    finalObject.id = child.key;
                }
                array.push(finalObject);
            });
            this.dispatch({
                type: 'GET_' + actionName + '_SUCCESS',
                [recordsName]: array
            });
        },
        (error) => {
            this.dispatch({type: 'GET_' + actionName + '_FAILED'});
        });
    }

    getRecordsOrdered(recordsName, criteria, reverse) {
        var actionName = recordsName.toUpperCase();
        this.dispatch({type: 'GET_' + actionName + '_REQUEST'});
        this.firebaseDatabase.ref(recordsName).orderByChild(criteria).on('value',
        (snapshot) => {
            var array = [];
            snapshot.forEach((child) => {
                var finalObject = child.val();
                finalObject.id = child.key;
                array.push(finalObject);
            });
            this.dispatch({
                type: 'GET_' + actionName + '_SUCCESS',
                [recordsName]: reverse ? array.reverse() : array
            });
        },
        (error) => {
            this.dispatch({type: 'GET_' + actionName + '_FAILED'});
        });
    }

    addRecordKey(recordName) {
        var actionName = recordName.toUpperCase();
        var reference = this.firebaseDatabase.ref().child(recordName).push().key;
        var initialDB = {
            number: '0/2016'
        }

        return this.firebaseDatabase.ref().child(recordName + '/' + reference).update(
            initialDB,
            (error) => {
                if (error) {
                    console.log(error);
                } else {
                    return dispatch({
                        type: 'ADD_' + actionName,
                        reference: reference
                    });
                }
            }
        );
    }

    addRecordWithContent(recordName, recordContent, notificationFailed, notificationSuccess) {
        var actionName = recordName.toUpperCase();
        this.dispatch({type: 'ADD_' + actionName + '_REQUEST'});
        var reference = this.firebaseDatabase.ref().child(recordName).push().key;
        return this.firebaseDatabase.ref().child(recordName + '/' + reference).update(
            recordContent,
            (error) => {
                if (error) {
                    return dispatch({type: 'ADD_' + actionName + '_FAILED', notification: notificationFailed});
                } else {
                    return dispatch({type: 'ADD_' + actionName + '_SUCCESS', notification: notificationSuccess});
                };
            }
        );
    }

    updateRecord(recordName, recordId, recordContent, notificationFailed, notificationSuccess) {
        var actionName = recordName.toUpperCase();
        this.dispatch({type: 'UPDATE_' + actionName + '_REQUEST'});

        if (recordId == null) {
            var reference = this.firebaseDatabase.ref().child(recordName);
        } else {
            var reference = this.firebaseDatabase.ref().child(recordName + '/' + recordId);
        }

        return reference.update(
            recordContent,
            (error) => {
                if (error) {
                    if (notificationFailed) {
                        this.dispatch({
                            type: 'UPDATE_' + actionName + '_FAILED',
                            notification: notificationFailed
                        });
                    }
                } else {
                    if (notificationSuccess) {
                        this.dispatch({
                            type: 'UPDATE_' + actionName + '_SUCCESS',
                            [recordName]: recordContent,
                            notification: notificationSuccess
                        });
                    }
                };
            }
        );
    }

    setRecord(recordName, recordContent, notificationFailed, notificationSuccess) {
        var actionName = recordName.toUpperCase();
        this.dispatch({type: 'SET_' + actionName + '_REQUEST'});
        var reference = this.firebaseDatabase.ref().child(recordName);
        return reference.set(
            recordContent,
            (error) => {
                if (error) {
                    if (notificationFailed) {
                        this.dispatch({
                            type: 'SET_' + actionName + '_FAILED',
                            notification: notificationFailed
                        });
                    }
                } else {
                    if (notificationSuccess) {
                        this.dispatch({
                            type: 'SET_' + actionName + '_SUCCESS',
                            [recordName]: recordContent,
                            notification: notificationSuccess
                        });
                    }
                };
            }
        );
    }

    cloneRecord(recordName, recordId, notificationFailed, notificationSuccess) {
        var actionName = recordName.toUpperCase();
        this.dispatch({type: 'CLONE_' + actionName + '_REQUEST'})
        const record = this.getState()[recordName].all.filter(value => {
            return value.id == recordId ? true : false
        });

        if(record.length == 1) {
            var reference = this.firebaseDatabase.ref(recordName).push().key;
            return this.firebaseDatabase.ref(recordName).child(reference).update(
                record[0],
                (error) => {
                    if (error) {
                        return dispatch({type: 'CLONE_' + actionName + '_FAILED', notification: notificationFailed});
                    } else {
                        return dispatch({type: 'CLONE_' + actionName + '_SUCCESS', notification: notificationSuccess});
                    };
                }
            );
        } else {
            this.firebaseDatabase.ref(recordName).child(recordId).once('value').then((snapshot) => {
                var reference = this.firebaseDatabase.ref(recordName).push().key;
                return this.firebaseDatabase.ref(recordName).child(reference).update(
                    snapshot.val(),
                    (error) => {
                        if (error) {
                            return dispatch({type: 'CLONE_' + actionName + '_FAILED', notification: notificationFailed});
                        } else {
                            return dispatch({type: 'CLONE_' + actionName + '_SUCCESS', notification: notificationSuccess});
                        };
                    }
                );
            });
        }
    }

    deleteRecord(recordName, recordId, notificationSuccess) {
        var actionName = recordName.toUpperCase();
        this.firebaseDatabase.ref().child(recordName + '/' + recordId).remove();
        return {
            type: 'DELETE_' + actionName,
            id: recordId,
            notification: notificationSuccess
        }
    }

    showNotification(notification) {
        return {
            type: 'SIMPLE_NOTIFICATION',
            notification: notification
        }
    }

}

export default ReduxOnFire;
