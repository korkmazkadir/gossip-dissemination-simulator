var mainApp = angular.module("gossipDissemination", []);

mainApp.controller('mainController', function($scope) {
   
   const nodes = [];


   function createNode(id){
      return{
         id: id,
         neighbours:[],
         inbox:[],
         outbox:[],
         round: 0,
         logs:[],
         send:function(message){
            this.outbox.push(message);
         },
         deliver:function(){
            this.outbox.forEach( m => this.neighbours.forEach( n => n.inbox.push( m )));
            this.round++;
         },
         process: function(){
            this.inbox.forEach( m => {
               this.logs.push( this.round + " - " + m);
               this.send( m );
            })
         }
      };
   }


   function getRandomInt(max) {
     return Math.floor(Math.random() * Math.floor(max));
   }

   function createNodes(numberOfNodes){
      for(var i = 0; i < numberOfNodes ; i++){
         nodes.push(createNode(i));
      }
   }

   function assignNeighbours(numberOfNeighbours){

      const maxNodeId = node.length - 1;

      nodes.forEach( n => {
         while(n.neighbours < numberOfNeighbours){
            const randomNumber = getRandomInt(maxNodeId);

         }
      });
   }


});