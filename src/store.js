import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import 'firebase/auth';
import db from './database';

Vue.use(Vuex, moment);

export default new Vuex.Store({
  state: {
    userID: 'default',
    userEmail: null,
    userData: {
      addresses: [

      ],
      foods: [

      ],
      info: {

      },
      tagList: [

      ],
      months: [

      ],
    },
    userCalendar: [],
    userAddresses: [],
    defaultID: 'default',
    defaultData: {
      addresses: [

      ],
      foods: [

      ],
      info: {

      },
      tagList: [

      ],
      months: [

      ],
    },
    defaultCalendar: [],
    defaultAddresses: [],
    authFlag: true,
    mealName: null,
    newIngredient: null,
    newAmount: null,
    newUnit: null,
    currentPage: 'calendar',
    price: 0,
    today: null,
    pointer: {
      doc: '',
      position: '',
    },
    editor: {
      id: null,
    },
    displayAmount: 7,
    profileFilters: [
      {
        text: 'Account',
        isActive: true,
      },
      {
        text: 'Places',
        isActive: false,
      },
      {
        text: 'Filters',
        isActive: false,
      },
    ],
    menu: {
      text: 'Menu',
      isActive: true,
    },
    meal: {
      id: null,
      uniqueID: null,
      name: null,
      ingredients: [],
      tags: [],
    },
    item: {
      ingredient: null,
      amount: null,
      unit: null,
      isActive: false,
    },
    ingredientsList: {
      ingredient: null,
      amount: null,
      unit: null,
      isActive: false,
    },
    listMonths: [],
    listMonthsDefault: [],
  },
  mutations: {
    populateMonthList(state, currentYear) {
      state.listMonths = [];
      state.listMonthsDefault = [];
      for (let y = 0; y < 2; y++) {
        for (let month = 0; month < 12; month++) {
          state.listMonths.push({
            month: moment().year(Number(currentYear) + y).month(month),
            isActive: false,
            isPurchased: false,
          });
        }
      }
      if (state.userData.months.length > 0) {
        for (let m = 0; m < state.userData.months.length; m++) {
          for (let l = 0; l < state.listMonths.length; l++) {
            if (state.userData.months[m] === state.listMonths[l].month.format('YYYYMM')) {
              Vue.set(state.listMonths[l], 'isPurchased', true);
            }
          }
        }
      }
      for (let y = 0; y < 2; y++) {
        for (let month = 0; month < 12; month++) {
          state.listMonthsDefault.push({
            month: moment().year(Number(currentYear) + y).month(month),
            isActive: false,
            isPurchased: false,
          });
        }
      }
      if (state.defaultData.months.length > 0) {
        for (let m = 0; m < state.defaultData.months.length; m++) {
          for (let l = 0; l < state.listMonthsDefault.length; l++) {
            if (state.defaultData.months[m] === state.listMonthsDefault[l].month.format('YYYYMM')) {
              Vue.set(state.listMonthsDefault[l], 'isPurchased', true);
            }
          }
        }
      }
    },
    syncMealName(state, mealName) {
      state.mealName = mealName;
    },
    syncIngredient(state, ingredient) {
      state.newIngredient = ingredient;
    },
    syncAmount(state, amount) {
      state.newAmount = Number(amount);
    },
    syncUnit(state, unit) {
      state.newUnit = unit;
    },
    setEditor(state, meal) {
      state.editor.id = meal.id;
      state.editor.uniqueID = meal.uniqueID;
    },
    resetPointer(state) {
      state.pointer.position = '';
      state.pointer.doc = '';
    },
    setEditFilters(state) {
      for (let t = 0; t < state.userData.tagList.length; t++) {
        state.userData.tagList[t].isActive = false;
      }
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].id === state.editor.id) {
          for (let t = 0; t < state.userData.tagList.length; t++) {
            for (let tag = 0; tag < state.userData.foods[f].tags.length; tag++) {
              if (state.userData.foods[f].tags[tag] === state.userData.tagList[t].text) {
                state.userData.tagList[t].isActive = true;
              }
            }
          }
        }
      }
    },
    changeFilters(state) {
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].uniqueID === state.editor.uniqueID) {
          state.userData.foods[f].tags.splice(0, state.userData.foods[f].tags.length);
          for (let t = 0; t < state.userData.tagList.length; t++) {
            if (state.userData.tagList[t].isActive) {
              state.userData.foods[f].tags.push(state.userData.tagList[t].text);
            }
          }
        }
      }
    },
    toggleIsActive(state, item) {
      item.isActive = !item.isActive;
    },
    toggleSelected(state, month) {
      if (month.isPurchased === false) {
        month.isActive = !month.isActive;
        if (month.isActive === true) {
          state.price += 5;
        } else {
          state.price -= 5;
        }
      }
    },
    addMonthsToDefault(state) {
      for (let month = 0; month < state.listMonthsDefault.length; month++) {
        if (state.listMonthsDefault[month].isActive === true) {
          const daysInMonth = state.listMonthsDefault[month].month.daysInMonth();
          const year = state.listMonthsDefault[month].month.format('YYYY');
          const mon = state.listMonthsDefault[month].month.format('MM');
          for (let d = 0; d < daysInMonth; d++) {
            const day = moment().year(year).month(mon).subtract(1, 'M')
              .startOf('month')
              .add(d, 'day')
              .format('DD');
            const docName = moment().year(year).month(mon).subtract(1, 'M')
              .date(day)
              .format('YYYYMMDD');
            const dayTemplate = {
              date: Number(moment().year(year).month(mon).subtract(1, 'M')
                .date(day)
                .format('YYYYMMDD')),
              day,
              dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                .date(day)
                .weekday()).format('dddd'),
              breakfast: 'Breakfast',
              breakfastID: '',
              breakfastLocation: 'Home',
              breakfastAddress: 'default',
              lunch: 'Lunch',
              lunchID: '',
              lunchLocation: 'Home',
              lunchAddress: 'default',
              dinner: 'Dinner',
              dinnerID: '',
              dinnerLocation: 'Home',
              dinnerAddress: 'default',
            };
            db.collection('users').doc('default').collection('calendar').doc(docName)
              .set(dayTemplate);
          }
          state.listMonthsDefault[month].isPurchased = true;
          state.defaultData.months.push(JSON.parse(JSON.stringify(state.listMonthsDefault[month].month.format('YYYYMM'))));
          Vue.set(state.listMonthsDefault[month], 'isActive', false);
        }
        state.price = 0;
      }
    },
    addMonths(state) {
      for (let month = 0; month < state.listMonths.length; month++) {
        if (state.listMonths[month].isActive === true) {
          const daysInMonth = state.listMonths[month].month.daysInMonth();
          const year = state.listMonths[month].month.format('YYYY');
          const mon = state.listMonths[month].month.format('MM');
          for (let d = 0; d < daysInMonth; d++) {
            const day = moment().year(year).month(mon).subtract(1, 'M')
              .startOf('month')
              .add(d, 'day')
              .format('DD');
            const docName = moment().year(year).month(mon).subtract(1, 'M')
              .date(day)
              .format('YYYYMMDD');
            const dayTemplate = {
              date: Number(moment().year(year).month(mon).subtract(1, 'M')
                .date(day)
                .format('YYYYMMDD')),
              day,
              dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                .date(day)
                .weekday()).format('dddd'),
              breakfast: 'Breakfast',
              breakfastID: '',
              breakfastLocation: 'Home',
              breakfastAddress: state.userAddresses[0].address,
              lunch: 'Lunch',
              lunchID: '',
              lunchLocation: 'Home',
              lunchAddress: state.userAddresses[0].address,
              dinner: 'Dinner',
              dinnerID: '',
              dinnerLocation: 'Home',
              dinnerAddress: state.userAddresses[0].address,
            };
            db.collection('users').doc(state.userID).collection('calendar').doc(docName)
              .set(dayTemplate);
          }
          state.listMonths[month].isPurchased = true;
          state.userData.months.push(JSON.parse(JSON.stringify(state.listMonths[month].month.format('YYYYMM'))));
          Vue.set(state.listMonths[month], 'isActive', false);
        }
        state.price = 0;
      }
    },
    setPage(state, page) {
      state.currentPage = page;
    },
    setToday(state, today) {
      state.today = Number(today);
      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days');
    },
    setBreakfast(state, day) {
      state.pointer.doc = state.userCalendar.indexOf(day);
      state.pointer.position = 'breakfast';
      for (let a = 0; a < state.userData.addresses.length; a++) {
        if (state.userData.addresses[a].isActive) {
          day.breakfastLocation = state.userData.addresses[a].name;
          day.breakfastAddress = state.userData.addresses[a].address;
        }
      }
      if (state.menu.isActive) {
        for (let t = 0; t < state.userData.tagList.length; t++) {
          state.userData.tagList[t].isActive = false;
        }
        state.userData.tagList[0].isActive = true;
      }
    },
    setLunch(state, day) {
      state.pointer.doc = state.userCalendar.indexOf(day);
      state.pointer.position = 'lunch';
      for (let a = 0; a < state.userData.addresses.length; a++) {
        if (state.userData.addresses[a].isActive) {
          day.lunchLocation = state.userData.addresses[a].name;
          day.lunchAddress = state.userData.addresses[a].address;
        }
      }
      if (state.menu.isActive) {
        for (let t = 0; t < state.userData.tagList.length; t++) {
          state.userData.tagList[t].isActive = false;
        }
        state.userData.tagList[1].isActive = true;
      }
    },
    setDinner(state, day) {
      state.pointer.doc = state.userCalendar.indexOf(day);
      state.pointer.position = 'dinner';
      for (let a = 0; a < state.userData.addresses.length; a++) {
        if (state.userData.addresses[a].isActive) {
          day.dinnerLocation = state.userData.addresses[a].name;
          day.dinnerAddress = state.userData.addresses[a].address;
        }
      }
      if (state.menu.isActive) {
        for (let t = 0; t < state.userData.tagList.length; t++) {
          state.userData.tagList[t].isActive = false;
        }
        state.userData.tagList[2].isActive = true;
      }
    },
    toggleLocation(state, address) {
      for (let a = 0; a < state.userData.addresses.length; a++) {
        Vue.set(state.userData.addresses[a], 'isActive', false);
      }
      Vue.set(address, 'isActive', true);
    },
    toggleFilter(state, filter) {
      filter.isActive = !filter.isActive;
    },
    toggleMenu(state, menu) {
      menu.isActive = !menu.isActive;
    },
    toggleProfileFilter(state, filter) {
      for (let p = 0; p < state.profileFilters.length; p++) {
        Vue.set(state.profileFilters[p], 'isActive', false);
      }
      Vue.set(filter, 'isActive', true);
    },
    thisWeek(state) {
      if (state.userID !== 'default') {
        for (let d = 0; d < state.userCalendar.length; d++) {
          db.collection('users').doc(state.userID).collection('calendar').doc(state.userCalendar[d].date.toString())
            .set(state.userCalendar[d]);
        }
      }
      const calendarRef = db.collection('users').doc(state.userID).collection('calendar');
      state.userCalendar = [];
      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days');
      calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            state.userCalendar.push(doc.data());
          });
        })
        .catch((error) => {
          console.log('Error getting documents: ', error);
        });
    },
    nextWeek(state) {
      if (state.userID !== 'default') {
        for (let d = 0; d < state.userCalendar.length; d++) {
          db.collection('users').doc(state.userID).collection('calendar').doc(state.userCalendar[d].date.toString())
            .set(state.userCalendar[d]);
        }
      }
      const calendarRef = db.collection('users').doc(state.userID).collection('calendar');
      state.userCalendar = [];
      calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            state.userCalendar.push(doc.data());
          });
        })
        .catch((error) => {
          console.log('Error getting documents: ', error);
        });
    },
    previousWeek(state) {
      if (state.userID !== 'default') {
        for (let d = 0; d < state.userCalendar.length; d++) {
          db.collection('users').doc(state.userID).collection('calendar').doc(state.userCalendar[d].date.toString())
            .set(state.userCalendar[d]);
        }
      }
      const calendarRef = db.collection('users').doc(state.userID).collection('calendar');
      state.userCalendar = [];
      state.start = state.start.subtract(state.displayAmount, 'days');
      calendarRef.where('date', '>=', Number(state.start.subtract(state.displayAmount, 'days').format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            state.userCalendar.push(doc.data());
          });
        })
        .catch((error) => {
          console.log('Error getting documents: ', error);
        });
    },
    addItem(state, place) {
      state.item.ingredient = state.newIngredient;
      state.item.amount = state.newAmount;
      state.item.unit = state.newUnit;
      if (state.item.ingredient === null || state.item.amount === null || state.item.unit === null) {
        alert('Please fill in all fields before adding a new ingredient.');
      } else {
        state.userAddresses[place].personalList.push(state.item);
        state.newIngredient = null;
        state.newAmount = null;
        state.newUnit = null;
        state.item = {
          ingredient: null,
          amount: null,
          unit: null,
          isActive: false,
        };
      }
      document.getElementById('ingredient').focus();
    },
    addIngredientToMeal(state) {
      state.ingredientsList.ingredient = state.newIngredient;
      state.ingredientsList.amount = state.newAmount;
      state.ingredientsList.unit = state.newUnit;
      state.meal.ingredients.push(state.ingredientsList);
      state.newIngredient = null;
      state.newAmount = null;
      state.newUnit = null;
      state.ingredientsList = {
        ingredient: null,
        amount: null,
        unit: null,
        isActive: false,
      };
      document.getElementById('newIngredient').focus();
    },
    addIngredient(state) {
      state.ingredientsList.ingredient = state.mealName;
      state.ingredientsList.amount = state.newAmount;
      state.ingredientsList.unit = state.newUnit;
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].id === state.editor.id) {
          if (state.ingredientsList.ingredient === null || state.ingredientsList.amount === null || state.ingredientsList.unit === null) {
            alert('Please fill in all fields before adding a new ingredient.');
          } else {
            state.userData.foods[f].ingredients.push(JSON.parse(JSON.stringify(state.ingredientsList)));
          }
        }
      }
      state.mealName = null;
      state.newAmount = null;
      state.newUnit = null;
    },
    deleteIngredient(state, ingredient) {
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].id === state.editor.id) {
          for (let i = 0; i < state.userData.foods[f].ingredients.length; i++) {
            if (state.userData.foods[f].ingredients[i].ingredient === ingredient.ingredient) {
              state.userData.foods[f].ingredients.splice(i, 1);
            }
          }
        }
      }
    },
    selectMeal(state, meal) {
      const mealName = JSON.parse(JSON.stringify(meal.name));
      const mealID = JSON.parse(JSON.stringify(meal.uniqueID));
      if (state.pointer.position === 'breakfast') {
        state.userCalendar[state.pointer.doc].breakfast = mealName;
        state.userCalendar[state.pointer.doc].breakfastID = mealID;
      } else if (state.pointer.position === 'lunch') {
        state.userCalendar[state.pointer.doc].lunch = mealName;
        state.userCalendar[state.pointer.doc].lunchID = mealID;
      } else {
        state.userCalendar[state.pointer.doc].dinner = mealName;
        state.userCalendar[state.pointer.doc].dinnerID = mealID;
      }
    },
    removeMeal(state) {
      if (state.pointer.position === 'breakfast') {
        Vue.set(state.userCalendar[state.pointer.doc], 'breakfast', 'Breakfast');
      } else if (state.pointer.position === 'lunch') {
        Vue.set(state.userCalendar[state.pointer.doc], 'lunch', 'Lunch');
      } else {
        Vue.set(state.userCalendar[state.pointer.doc], 'dinner', 'Dinner');
      }
    },
    addMealName(state) {
      if (state.mealName) {
        if (state.userData.foods.length + 1 < 10) {
          state.meal.id = `0${state.userData.foods.length + 1}`;
        } else {
          state.meal.id = state.userData.foods.length + 1;
        }
        state.meal.name = state.mealName;
        document.getElementById('newIngredient').focus();
      } else {
        alert('You need to enter a recipe name.');
      }
    },
    addMeal(state) {
      if (state.meal.name) {
        for (let t = 0; t < state.userData.tagList.length; t++) {
          if (state.userData.tagList[t].isActive) {
            state.meal.tags.push(state.userData.tagList[t].text);
          }
        }
        state.meal.uniqueID = new Date().getTime().toString() + (Math.floor((Math.random() * 10000000) + 1)).toString();
        state.userData.foods.push(state.meal);
        state.meal = {
          id: null,
          uniqueID: null,
          name: null,
          ingredients: [],
          tags: [],
        };
        state.mealName = null;
      } else {
        alert('You need to add a recipe name');
      }
    },
    deleteMeal(state) {
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].id === state.editor.id) {
          state.userData.foods.splice(f, 1);
        }
      }
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (f + 1 < 10) {
          var singleDigit = f + 1;
          state.userData.foods[f].id = `0${singleDigit}`;
        } else {
          state.userData.foods[f].id = singleDigit.toString();
        }
      }
    },
    addFilter(state, newFilter) {
      const newObject = {
        text: '',
        isActive: false,
      };
      newObject.text = newFilter;
      state.userData.tagList.push(newObject);
      document.getElementById('newFilter').focus();
    },
    deleteFilter(state, tag) {
      for (let t = 0; t < state.userData.tagList.length; t++) {
        if (state.userData.tagList[t].text === tag.text) {
          state.userData.tagList.splice(t, 1);
        }
      }
    },
    addPlace(state, newPlace) {
      db.collection('addresses').add({
        address: '',
        members: [{
          email: state.userEmail,
          role: 'Owner',
          uid: state.userID,
        }],
        personalList: [],
        shoppingList: [],
      })
        .then((docRef) => {
          const newAddress = {
            name: newPlace,
            isActive: false,
            address: docRef.id,
          };
          state.userData.addresses.push(newAddress);
          db.collection('users').doc(state.userID).set(state.userData);
          db.collection('addresses').doc(docRef.id).update({
            address: docRef.id,
          });
          state.userAddresses = [];
          for (let a = 0; a < state.userData.addresses.length; a++) {
            const addressRef = db.collection('addresses').doc(state.userData.addresses[a].address);
            addressRef.get()
              .then((doc) => {
                if (doc.exists) {
                  state.userAddresses.push(doc.data());
                } else {
                  // doc.data() will be undefined in this case
                  console.log('No such document!');
                }
              })
              .catch((error) => {
                console.log('Error getting document.', error);
              });
          }
        })
        .catch((error) => {
          console.log('Error adding document to addresses collection: ', error);
        });
    },
    deletePlace(state, place) {
      alert('Are you sure you want to remove this place?');
      const index = state.userData.addresses.indexOf(place);
      for (let m = 0; m < state.userAddresses[index].members.length; m++) {
        const docAddress = state.userAddresses[index].members[m].uid;
        if (state.userAddresses[index].members[m].role === 'Owner' && state.userAddresses[index].members[m].uid === state.userID) {
          // Deletes the address document in addresses collection.
          db.collection('addresses').doc(place.address).delete()
            .then(() => {
              console.log('Document successfully delete.');
            })
            .catch((error) => {
              console.log('Error removing document: ', error);
            });
        }
        // Gets the user data of each member and saves it into tempArray.
        const docRef = db.collection('users').doc(state.userAddresses[index].members[m].uid);
        var tempData = '';
        docRef.get()
          .then((doc) => {
            if (doc.exists) {
              tempData = doc.data();
              // Deletes the address out of the addressess record.
              for (let a = 0; a < tempData.addresses.length; a++) {
                if (tempData.addresses[a].address === place.address) {
                  tempData.addresses.splice(a, 1);
                }
              }
              // Saves the tempArray back into the edited users' document.
              db.collection('users').doc(docAddress).set(tempData);
              // Get new userData and userAddresses
              const docRef = db.collection('users').doc(state.userID);
              state.userData = '';
              state.userAddresses = [];
              docRef.get().then((doc) => {
                if (doc.exists) {
                  state.userData = doc.data();
                  for (let a = 0; a < state.userData.addresses.length; a++) {
                    const addressRef = db.collection('addresses').doc(state.userData.addresses[a].address);
                    addressRef.get()
                      .then((doc) => {
                        if (doc.exists) {
                          state.userAddresses.push(doc.data());
                        } else {
                          // doc.data() will be undefined in this case
                          console.log('No such document!');
                        }
                      });
                  }
                } else {
                  // doc.data() will be undefined in this case
                  console.log('No such document!');
                }
              }).catch((error) => {
                console.log('Error getting document:', error);
              });
            } else {
              // doc.data() will be undefined in this case
              console.log('No such document!');
            }
          })
          .catch((error) => {
            console.log('Error getting document:', error);
          });
      }
    },
    createList(state) {
      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days');
      for (let place = 0; place < state.userAddresses.length; place++) {
        // Empties shopping list and calendar list of the address in each iteration
        state.userAddresses[place].shoppingList = [];
        state.userAddresses[place].calendarList = [];
        state.userAddresses[place].foodsList = [];
        // Queries calendar list for each address in each iteration.
        for (let member = 0; member < state.userAddresses[place].members.length; member++) {
          // Populates userAddresses[place].calendarList per Address
          const calendarRef = db.collection('users').doc(state.userAddresses[place].members[member].uid).collection('calendar');
          calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                state.userAddresses[place].calendarList.push(doc.data());
              });
            })
            .catch((error) => {
              console.log('Error getting documents: ', error);
            });
          // Populates userAddresses[place].foodsList per Address
          const docRef = db.collection('users').doc(state.userAddresses[place].members[member].uid);
          docRef.get()
            .then((doc) => {
              if (doc.exists) {
                for (let meal = 0; meal < doc.data().foods.length; meal++) {
                  state.userAddresses[place].foodsList.push(doc.data().foods[meal]);
                }
              } else {
                console.log('userData doc is not there.');
              }
            })
            .catch((error) => {
              console.log('Error getting documents: ', error);
            });
        }
      }
      setTimeout(() => {
        populateShoppingLists();
      }, 1000);
      function populateShoppingLists() {
        state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days');
        for (let place = 0; place < state.userAddresses.length; place++) {
          // Goes through listCalendar and see's if either breakfastID, lunchID, or dinnerID corresponds with a uniqueID from the listFoods
          for (let day = 0; day < state.userAddresses[place].calendarList.length; day++) {
            if (state.userAddresses[place].calendarList[day].breakfastAddress === state.userAddresses[place].address) {
              for (let meal = 0; meal < state.userAddresses[place].foodsList.length; meal++) {
                if (state.userAddresses[place].calendarList[day].breakfastID === state.userAddresses[place].foodsList[meal].uniqueID) {
                  for (let ingredient = 0; ingredient < state.userAddresses[place].foodsList[meal].ingredients.length; ingredient++) {
                    let check = true;
                    for (let item = 0; item < state.userAddresses[place].shoppingList.length; item++) {
                      if (state.userAddresses[place].shoppingList[item].ingredient === state.userAddresses[place].foodsList[meal].ingredients[ingredient].ingredient) {
                        state.userAddresses[place].shoppingList[item].amount += state.userAddresses[place].foodsList[meal].ingredients[ingredient].amount;
                        check = false;
                      }
                    }
                    if (check) {
                      state.userAddresses[place].shoppingList.push(JSON.parse(JSON.stringify(state.userAddresses[place].foodsList[meal].ingredients[ingredient])));
                    }
                  }
                }
              }
            }
            if (state.userAddresses[place].calendarList[day].lunchAddress === state.userAddresses[place].address) {
              for (let meal = 0; meal < state.userAddresses[place].foodsList.length; meal++) {
                if (state.userAddresses[place].calendarList[day].lunchID === state.userAddresses[place].foodsList[meal].uniqueID) {
                  for (let ingredient = 0; ingredient < state.userAddresses[place].foodsList[meal].ingredients.length; ingredient++) {
                    let check = true;
                    for (let item = 0; item < state.userAddresses[place].shoppingList.length; item++) {
                      if (state.userAddresses[place].shoppingList[item].ingredient === state.userAddresses[place].foodsList[meal].ingredients[ingredient].ingredient) {
                        state.userAddresses[place].shoppingList[item].amount += state.userAddresses[place].foodsList[meal].ingredients[ingredient].amount;
                        check = false;
                      }
                    }
                    if (check) {
                      state.userAddresses[place].shoppingList.push(JSON.parse(JSON.stringify(state.userAddresses[place].foodsList[meal].ingredients[ingredient])));
                    }
                  }
                }
              }
            }
            if (state.userAddresses[place].calendarList[day].dinnerAddress === state.userAddresses[place].address) {
              for (let meal = 0; meal < state.userAddresses[place].foodsList.length; meal++) {
                if (state.userAddresses[place].calendarList[day].dinnerID === state.userAddresses[place].foodsList[meal].uniqueID) {
                  for (let ingredient = 0; ingredient < state.userAddresses[place].foodsList[meal].ingredients.length; ingredient++) {
                    let check = true;
                    for (let item = 0; item < state.userAddresses[place].shoppingList.length; item++) {
                      if (state.userAddresses[place].shoppingList[item].ingredient === state.userAddresses[place].foodsList[meal].ingredients[ingredient].ingredient) {
                        state.userAddresses[place].shoppingList[item].amount += state.userAddresses[place].foodsList[meal].ingredients[ingredient].amount;
                        check = false;
                      }
                    }
                    if (check) {
                      state.userAddresses[place].shoppingList.push(JSON.parse(JSON.stringify(state.userAddresses[place].foodsList[meal].ingredients[ingredient])));
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    setUser(state, user) {
      state.userID = user.uid;
      state.userEmail = user.email;
      state.authFlag = true;
    },
    setAuthFlag(state) {
      state.authFlag = false;
    },
    getData(state) {
      const docRef = db.collection('users').doc(state.userID);
      state.userAddresses = [];
      docRef.get()
        .then((doc) => {
          if (doc.exists) {
            state.userData = doc.data();
            for (let a = 0; a < state.userData.addresses.length; a++) {
              const addressRef = db.collection('addresses').doc(state.userData.addresses[a].address);
              addressRef.get()
                .then((doc) => {
                  if (doc.exists) {
                    state.userAddresses.push(doc.data());
                  } else {
                    // doc.data() will be undefined in this case
                    console.log('No such document!');
                  }
                })
                .catch((error) => {
                  console.log('Error: ', error);
                });
            }
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error);
        });

      const defaultDocRef = db.collection('users').doc(state.defaultID);
      state.defaultAddresses = [];
      defaultDocRef.get()
        .then((doc) => {
          if (doc.exists) {
            state.defaultData = doc.data();
            for (let a = 0; a < state.defaultData.addresses.length; a++) {
              const addressRef = db.collection('addresses').doc(state.defaultData.addresses[a].address);
              addressRef.get()
                .then((doc) => {
                  if (doc.exists) {
                    state.defaultAddresses.push(doc.data());
                  } else {
                    // doc.data() will be undefined in this case
                    console.log('No such document!');
                  }
                })
                .catch((error) => {
                  console.log('Error: ', error);
                });
            }
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error);
        });
    },
    getCalendar(state) {
      // if user is not default, then iterate through calendar and save it
      if (state.userID !== 'default' && state.userCalendar.length > 0) {
        for (let d = 0; d < state.userCalendar.length; d++) {
          db.collection('users').doc(state.userID).collection('calendar').doc(state.userCalendar[d].date.toString())
            .set(state.userCalendar[d]);
        }
      }
      const calendarRef = db.collection('users').doc(state.userID).collection('calendar');
      // reset userCalendar to avoid duplicates
      state.userCalendar = [];
      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days');
      if (state.userData.months.includes(moment().format('YYYYMM'))) {
        calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              state.userCalendar.push(doc.data());
            });
          })
          .catch((error) => {
            console.log('Error getting documents: ', error);
          });
      }
    },
    resetUserCalendar(state) {
      state.userCalendar = [];
    },
    saveData(state) {
      // Save both userCalendar and userData
      if (state.userID !== 'default') {
        db.collection('users').doc(state.userID).set(state.userData);
        for (let d = 0; d < state.userCalendar.length; d++) {
          db.collection('users').doc(state.userID).collection('calendar').doc(state.userCalendar[d].date.toString())
            .set(state.userCalendar[d]);
        }

        db.collection('users').doc(state.defaultID).set(state.defaultData);
      }
    },
    setDefaultUser(state) {
      // Avoid double firing of saveData
      if (state.authFlag) {
        // Set default user
        state.userID = 'default';
        state.userEmail = null;
        // Get default data
        const docRef = db.collection('users').doc(state.userID);
        docRef.get()
          .then((doc) => {
            if (doc.exists) {
              state.userData = doc.data();
            } else {
              // doc.data() will be undefined in this case
              console.log('No such document!');
            }
          }).catch((error) => {
            console.log('Error getting document:', error);
          });
        state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days');
        // Get default calendar
        const calendarRef = db.collection('users').doc(state.userID).collection('calendar');
        state.userCalendar = [];
        calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              state.userCalendar.push(doc.data());
            });
          })
          .catch((error) => {
            console.log('Error getting documents: ', error);
          });
        state.authFlag = false;

        const addressRef = db.collection('users').doc(state.userID);
        state.userAddresses = [];
        addressRef.get()
          .then((doc) => {
            if (doc.exists) {
              state.userData = doc.data();
              for (let a = 0; a < state.userData.addresses.length; a++) {
                const addressRef = db.collection('addresses').doc(state.userData.addresses[a].address);
                addressRef.get()
                  .then((doc) => {
                    if (doc.exists) {
                      state.userAddresses.push(doc.data());
                    } else {
                      // doc.data() will be undefined in this case
                      console.log('No such document!');
                    }
                  })
                  .catch((error) => {
                    console.log('Error: ', error);
                  });
              }
            } else {
              // doc.data() will be undefined in this case
              console.log('No such document!');
            }
          })
          .catch((error) => {
            console.log('Error getting document:', error);
          });
      }
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user);
      commit('getData');
      commit('getCalendar');
    },
    setDefault({ commit }) {
      commit('saveData');
      commit('setDefaultUser');
    },
  },
});
