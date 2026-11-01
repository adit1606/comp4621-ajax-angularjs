// COMP 4621 Assignment 2 - Part 3
// controller for the phone list (sorting is done with orderBy in index.html)
(function () {
  'use strict';

  angular.module('phoneBookApp', [])
    .controller('PhoneBookController', ['$scope', function ($scope) {

      // contacts - not in order on purpose so orderBy has to sort them
      $scope.contacts = [
        { name: 'Michael Brown',   phone: '250-555-0134' },
        { name: 'Aisha Patel',     phone: '604-555-0188' },
        { name: 'Zoe Thompson',    phone: '778-555-0112' },
        { name: 'Daniel Kim',      phone: '403-555-0175' },
        { name: 'Sofia Garcia',    phone: '250-555-0161' },
        { name: 'Liam O\'Connor',  phone: '416-555-0109' },
        { name: 'Harpreet Gill',   phone: '604-555-0150' },
        { name: 'Ethan Wright',    phone: '780-555-0127' },
        { name: 'Olivia Chen',     phone: '236-555-0193' },
        { name: 'Benjamin Ross',   phone: '250-555-0146' }
      ];

      // sort direction (false = A to Z)
      $scope.sortReverse = false;
      $scope.toggleSort = function () {
        $scope.sortReverse = !$scope.sortReverse;
      };

      // search box
      $scope.search = '';

      // add contact form
      $scope.newContact = { name: '', phone: '' };
      $scope.formError = '';
      $scope.lastAdded = '';

      // phone format like 250-555-0134
      $scope.phonePattern = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

      function formatPhone(raw) {
        var digits = raw.replace(/\D/g, '');
        return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
      }

      $scope.addContact = function (form) {
        $scope.formError = '';
        $scope.lastAdded = '';

        if (form.$invalid) {
          form.$setSubmitted();
          $scope.formError = 'Please fix the highlighted fields before adding the contact.';
          return;
        }

        var name = $scope.newContact.name.trim().replace(/\s+/g, ' ');
        var exists = $scope.contacts.some(function (c) {
          return c.name.toLowerCase() === name.toLowerCase();
        });
        if (exists) {
          $scope.formError = '"' + name + '" is already in the list.';
          return;
        }

        $scope.contacts.push({ name: name, phone: formatPhone($scope.newContact.phone) });
        $scope.lastAdded = name;

        // clear the form
        $scope.newContact = { name: '', phone: '' };
        form.$setPristine();
        form.$setUntouched();
      };

      $scope.removeContact = function (contact) {
        var i = $scope.contacts.indexOf(contact);
        if (i !== -1) { $scope.contacts.splice(i, 1); }
        $scope.lastAdded = '';
      };
    }]);
})();
