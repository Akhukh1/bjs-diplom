"use strict";

const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout(response => {
    if(response.success) {
      location.reload();
    }
  });
}

ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});


const ratesBoard = new RatesBoard();

function currentExchangeRate() {
  ApiConnector.getStocks(response => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data)
    }
  });
  return;
}

currentExchangeRate();
setInterval(currentExchangeRate, 60000);


const moneyManager = new MoneyManager();

function checkAndOutputMoneyManager(data, response, messege) {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, messege);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
}

moneyManager.addMoneyCallback = data => {
  ApiConnector.addMoney(data, response => checkAndOutputMoneyManager(data, response, 'Поплнение прошло успешно'));
}

moneyManager.conversionMoneyCallback = data => {
  ApiConnector.convertMoney(data, response => checkAndOutputMoneyManager(data, response, 'Валюта сконвертирована успешно'));
}

moneyManager.sendMoneyCallback = data => {
  ApiConnector.transferMoney(data, response => checkAndOutputMoneyManager(data, response, 'Перевод совершен успешно'));
}


const favoritesWidget = new FavoritesWidget();

function checkAndOutputFavoritesWidget(data, response, messege) {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    favoritesWidget.setMessage(true, messege);
  } else {
    favoritesWidget.setMessage(response.success, response.error);
  }
}

ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});


favoritesWidget.addUserCallback = data => {
  ApiConnector.addUserToFavorites(data, response => checkAndOutputFavoritesWidget(data, response, 'Добавление пользователя произведено успешно'));
};

favoritesWidget.removeUserCallback = data => {
  ApiConnector.removeUserFromFavorites(data, response => checkAndOutputFavoritesWidget(data, response, 'Удаление пользователя произведено успешно'));
};









