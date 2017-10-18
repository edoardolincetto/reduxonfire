# ReduxOnFire

## Getting started

To install ReduxOnFire just go ahead and use

```
yarn add reduxonfire
```

or, if you don't use Yarn.

```
npm install reduxonfire
```

ReduxOnFire brings out the best of it's features when used alongside the - [Abimis Framework](https://github.com/aterrae/abimis/).

## API

ReduxOnFire is a project that contains a set of comprehensive API's to be used in order to use Firebase alongside Redux.

## Notifications

ReduxOnFire also provides a set of Notification management methods that can be used to create a custom notification manager which reacts to changes in the Redux state.

```
Custom Notification manager integration docs are Work In Progress
```

## API reference

### Auth

- [signup](#signup)
- [login](#login)
- [watchAuth](#watchAuth)
- [passwordReset](#passwordReset)
- [facebook](#facebook)
- [google](#google)
- [logout](#logout)

### Realtime Database

- [watchRecords](#watchRecords)
- [watchRecordsOrdered](#watchRecordsOrdered)
- [getRecordsFiltered](#getRecordsFiltered)
- [getRecordById](#getRecordById)
- [getRecordByContent](#getRecordByContent)
- [addRecord](#addRecord)
- [updateRecord](#updateRecord)
- [setRecord](#setRecord)
- [deleteRecord](#deleteRecord)

### Firebase Storage

- [uploadFile](#uploadFile)
- [deleteFile](#deleteFile)

### Notifications

- [addNotification](#addNotification)
- [removeNotification](#removeNotification)
- [clearNotifications](#clearNotifications)

--------------------------------------------------------------------------------

## Auth

### `signup`

Register a user to your platform by using an email and a password.

**Params**

Name         | Type     | Description                                        | Required
:----------- | :------- | :------------------------------------------------- | :-------
**email**    | `string` | The email that the user is gonna use to sign up    | Yes
**password** | `string` | The password that the user is gonna use to sign up | Yes

### `login`

Logs an already existing user into the platform using an email and a password.

**Params**

Name         | Type     | Description                                      | Required
:----------- | :------- | :----------------------------------------------- | :-------
**email**    | `string` | The email that the user is gonna use to login    | Yes
**password** | `string` | The password that the user is gonna use to login | Yes

### `watchAuth`

Checks whether there is a signed in user in the local session.

### `passwordReset`

Sends an email to the specified address with a link to reset the password.

**Params**

Name      | Type     | Description                                                    | Required
:-------- | :------- | :------------------------------------------------------------- | :-------
**email** | `string` | The email that is going to receive the password resetting mail | Yes

### `facebook`

Processes a user session using the Facebook identity provider. If there is no account linked to that Facebook account then a new user is created.

### `google`

Processes a user session using the Google identity provider. If there is no account linked to that Google account then a new user is created.

### `logout`

Terminates the current user session that's currently going on.

## Realtime Database

### `watchRecords`

Watches the records of the selected document for changes and returns the content of the document whenever it's updated.

**Params**

Name            | Type      | Description                                                                           | Required
:-------------- | :-------- | :------------------------------------------------------------------------------------ | :-------
**recordsName** | `string`  | The name of the document that you want to watch                                       | Yes
**returnId**    | `boolean` | Set to `true` if you want the returned objects to have their id's as a key value pair | No
**reverse**     | `boolean` | Set to true if you want to reverse the order of the returned objects                  | No

### `watchRecordsOrdered`

Same as watchRecords but instead of returning them in a pseudorandom order it orders them based on the specified parameter.

**Params**

Name            | Type      | Description                                                                           | Required
:-------------- | :-------- | :------------------------------------------------------------------------------------ | :-------
**recordsName** | `string`  | The name of the document that you want to watch                                       | Yes
**returnId**    | `boolean` | Set to `true` if you want the returned objects to have their id's as a key value pair | No
**criteria**    | `string`  | Set to the name of the value to use as the criteria to order the returned objects     | Yes
**reverse**     | `boolean` | Set to true if you want to reverse the order of the returned objects                  | No

### `getRecordsFiltered`

A method that returns the result of passing the content of a document through a custom filtering function.

**Params**

Name            | Type       | Description                                                                               | Required
:-------------- | :--------- | :---------------------------------------------------------------------------------------- | :-------
**recordsName** | `string`   | The name of the document that you want to filter                                          | Yes
**filter**      | `function` | The function that given the array of the objects of the document returns a filtered array | Yes

### `getRecordById`

Returns a single object by searching for an object with the matching id.

**Params**

Name           | Type     | Description                                                  | Required
:------------- | :------- | :----------------------------------------------------------- | :-------
**recordName** | `string` | The name of the document where you wanna look for the object | Yes
**recordId**   | `string` | The id of the object to return                               | Yes

### `getRecordByContent`

Returns a single object by searching for an object with the matching content.

**Params**

Name              | Type     | Description                                                  | Required
:---------------- | :------- | :----------------------------------------------------------- | :-------
**recordName**    | `string` | The name of the document where you wanna look for the object | Yes
**recordContent** | `any`    | The content of the object to return                          | Yes

### `addRecord`

Adds an object to the specified document with a pseudorandom ID and the provided content

**Params**

Name              | Type     | Description                                             | Required
:---------------- | :------- | :------------------------------------------------------ | :-------
**recordName**    | `string` | The name of the document where you wanna add the object | Yes
**recordContent** | `any`    | The content of the object to add                        | Yes

### `updateRecord`

Updates the specified object by changing it's content from the old content to the one passed to the method

**Params**

Name              | Type     | Description                                                | Required
:---------------- | :------- | :--------------------------------------------------------- | :-------
**recordName**    | `string` | The name of the document where you wanna update the object | Yes
**recordId**      | `string` | The Id of the object that you want to update               | Yes
**recordContent** | `any`    | The updated content of the object                          | Yes

### `setRecord`

Completely overrides the contents of a document by changing it with the passed content.

**Params**

Name              | Type     | Description                                        | Required
:---------------- | :------- | :------------------------------------------------- | :-------
**recordName**    | `string` | The name of the document that you want to override | Yes
**recordContent** | `any`    | The new content of the document                    | Yes

### `deleteRecord`

Deletes the item that has the same Id as the one passed.

**Params**

Name           | Type     | Description                                                 | Required
:------------- | :------- | :---------------------------------------------------------- | :-------
**recordName** | `string` | The name of the document where you want to delete an object | Yes
**recordId**   | `string` | The id of the Object that has to be deleted                 | Yes

## Firebase storage

### `uploadFile`

Uploads an array of files to the specified location of the Firebase Storage.

**Params**

Name           | Type                            | Description                                                                         | Required
:------------- | :------------------------------ | :---------------------------------------------------------------------------------- | :-------
**recordName** | `string`                        | The reference of the bucket that will be used to store the uploaded files           | Yes
**filesArray** | `Array<Files>` or `Array<Blob>` | An array of File representing objects that will be uploaded to the Firebase Storage | Yes

### `deleteFile`

Deletes a file by specifying it's full reference

**Params**

Name           | Type     | Description                                                              | Required
:------------- | :------- | :----------------------------------------------------------------------- | :-------
**recordName** | `string` | The reference of the bucket that stores the file                         | Yes
**fileRef**    | `string` | The name of the file that will be dleted comprehensive of it's extension | Yes

## Notifications

### `addNotification`

Adds a notification to the notification manager.

**Params**

Name             | Type     | Description                                                                    | Required
:--------------- | :------- | :----------------------------------------------------------------------------- | :-------
**notification** | `Object` | An object that represents the notification that has to be added to the manager | Yes

### `removeNotification`

Removes the specified notification from the manager.

**Params**

Name   | Type     | Description                                                        | Required
:----- | :------- | :----------------------------------------------------------------- | :-------
**id** | `string` | The ID of the notification that has to be removed from the manager | Yes

### `clearNotifications`

Clears all of the notification that are currently displayed by the manager.
