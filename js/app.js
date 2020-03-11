var mainApp = angular.module("gossipDissemination", []);

mainApp.controller('mainController', function($scope) {
   
   const hashCode = s => s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0);

   const stringToColour = function(str) {
     var hash = 0;
     for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
     }
     var colour = '#';
     for (var i = 0; i < 3; i++) {
       var value = (hash >> (i * 8)) & 0xFF;
       colour += ('00' + value.toString(16)).substr(-2);
     }
     return colour;
   }

   const nodes = [];


   function createNode(id){
      return{
         id: id,
         neighbours:[],
         inbox:[],
         outbox:[],
         round: 1,
         logs:[],
         processedMessages:[],
         range: -1,
         send:function(message){
            this.outbox.push(message);
         },
         deliver:function(){
            this.outbox.forEach( m => this.neighbours.forEach( n => n.inbox.push( m )));
            this.outbox.length = 0
            this.round++;
         },
         process: function(){
            this.inbox.forEach( m => {
               if(this.processedMessages.includes(m) === false){
                  this.logs.push(m);
                  this.send( m );
                  this.processedMessages.push( m );
               }
            })
            this.inbox.length = 0
            this.round++;
         },
         getColor:function(){
            //return stringToColour(this.logs.join("-"));
            return "steelblue";
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

      Math.seedrandom(numberOfNeighbours + "");

      //clears neighbours
      nodes.forEach(n => { n.neighbours.length = 0});

      const maxNodeId = nodes.length;
      nodes.forEach( n => {
         //console.log("-----> Assigning neighbour for: " + n.id);
         var assignedNeighbours = 0;
         while(assignedNeighbours < numberOfNeighbours){

            const randomNumber = getRandomInt(maxNodeId);
            const selectedNeighbour = nodes[randomNumber];
            if(n.neighbours.includes(selectedNeighbour) === false){
               n.neighbours.push(selectedNeighbour);
               selectedNeighbour.neighbours.push(n);
               //console.log("=> " + selectedNeighbour.id);
               assignedNeighbours++;
            }
         }
         assignedNeighbours = 0;
      });
   }

   createNodes(3000);
   assignNeighbours(4);

   nodes[31].inbox.push("message from 33 --");
   nodes[53].inbox.push("message from 53 CDF");


   var counter = 1;
   while(areThereMessagesToProcess(2)){
      console.log("Running iteration: " + counter);

      nodes.forEach(n => {
         n.process();
         n.deliver();
      });

      counter++;

      if(counter > 20){
         break;
      }

   }


   console.log("################## Results ##############################");
   //nodes.forEach(n => {
   //   console.log("-----------> Node: " + n.id);
   //   n.logs.forEach(l => console.log(l) );
   //})


   function areThereMessagesToProcess(numberOfProcessedMessages){
      return !nodes.every(n => n.processedMessages.length === numberOfProcessedMessages);
   }


   function areThereProcessWithoutRange(){
      return !nodes.every(n => n.range !== -1);
   }


   function assignRanges(centerNode){

      //clears ranges
      nodes.forEach(n => { n.range = -1});

      var range = 0;
      centerNode.range = range;
      var waitingToAssignRange = centerNode.neighbours;
      var temporary = [];
      while(areThereProcessWithoutRange()){
         range++;
         waitingToAssignRange.forEach(n => {
            if(n.range === -1){
               n.range = range;
               temporary = temporary.concat(n.neighbours);
            }
         })
         waitingToAssignRange = temporary.slice();
         temporary.length = 0;
      }
      console.log("Max range is " + range);
   }


   const centerNode = nodes[100];
   assignRanges(centerNode);

   drawNetwork(nodes);


   $scope.getNumberOfNodes = function(){
      return nodes.length;
   }



   $scope.centerNode = nodes.length /2;
   $scope.updateNetwork = function(){
      console.log($scope.centerNode);
      const centerNode = nodes[$scope.centerNode];
      assignRanges(centerNode);
      console.log("Center node range: " + centerNode.range);
      updateNetwork(nodes);
   }

   $scope.degree = 3;
   $scope.updateDegree = function(){
      assignNeighbours($scope.degree);
      const centerNode = nodes[$scope.centerNode];
      assignRanges(centerNode);
      updateNetwork(nodes);
   }



});