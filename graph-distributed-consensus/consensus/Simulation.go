package main

import (
	"math/rand"
	"fmt"
	"sync"
	"time"
	"os"
	"strconv"
)

var wg = new(sync.WaitGroup)
var numNodes,_ = strconv.Atoi(os.Args[1])
var numRounds,_ = strconv.Atoi(os.Args[2])

//Below values are set on the probablity line; 0 to 1
var p_graph,_ = strconv.ParseFloat(os.Args[3],64) // parameter for random graph: prob. that an edge will exist
var p_malicious,_ = strconv.ParseFloat(os.Args[4],64) // prob. that a node will be set to be malicious
var p_txDistribution,_ = strconv.ParseFloat(os.Args[5],64) // probability of assigning an initial transaction to each node




//Create Channles to communicate between go routines.
var transactions = make(chan map[int][]int,100000)
var transactions_consensus = make(chan map[int][]int,100000)

//Function to create fixed length random integers
func randRangeIn(low, hi int) int {
	return low + rand.Intn(hi-low)
}

//Function to check if element is in array
func isInArray(a int, Array []int) bool {
	for _, b := range Array {
		if b == a {
			return true
		}
	}
	return false
}

//Function to delete elemnt form array
func removeIndex(s []int, index int) []int {
	return append(s[:index], s[index+1:]...)
}

//Generate a pool of valid transactions
func genTrxPool(numTx int)[]int {
	// initialize a set of 500 valid Transactions with random ids

	var validTxIds []int
	for i := 0; i < numTx; i++ {
		r := randRangeIn(10000000, 99999999)
		validTxIds= append(validTxIds,r)
	}
	return validTxIds
}

//Set Followwes that each node will receive transactions from.
//Probability that an edge will exist is determined by p_graph
func setFollowees(nodeId int)[]int {
	var followees [] int
	for i := 0; i < numNodes; i++ {
		if rand.Float64() < p_graph {
			if i != nodeId {
				followees = append(followees, i)
			}
		}

	}
	return followees
}


//Take trx pool and get initial transactions,return an array of transactions.
//Probability of assigning an initial transaction to each node is determined by p_txDistribution
func getInitialTrxArray(trxPool []int)[]int {
	//initiate array to hiold transacs
	var trxArray []int

	for i := 0; i < len(trxPool); i++ {
		//get initial set of trx with p_distribution
		if rand.Float64() < p_txDistribution {
			trxArray = append(trxArray, trxPool[i])
		}
	}
	return trxArray
}

//Propogate the transaxctions received in each round to the followers
func setTrx(trx_map map[int][]int,trxArray []int,nodeId int){
			trx_map[nodeId] = trxArray
		//write into channel
		transactions <- trx_map
	}


//Write the final set of transactions that each node beleives consensus on to a channel
func setTrx_consensus(trx_map map[int][]int,trxArray_consensus []int,nodeId int){
	 trx_map[nodeId] = trxArray_consensus
	//write into channel
	time.Sleep(time.Second * 4)
	transactions_consensus <- trx_map
}


//Read proposed Trx form followwees and check if the trx are valid and determine malicious nodes.
func checkMaliciousandGet(trxArray [] int,followees []int,nodeId int,trxPool[]int)[]int {
	time.Sleep(time.Second * 4)
	trxArray = nil
	for _,ef := range followees{
		for et := range transactions{
			for ind,n:= range et[ef]{
				if (isInArray(n,trxPool)==false){
					//fmt.Println(nodeId,":Transaction ",n, " from ",ef," seems maliciuous")
					removeIndex(et[ef],ind)
				}
			}
			//aapend transacs to array

			trxArray = append(trxArray,et[ef]...)

		}

	}
	return trxArray
}

//Spin and process a compliant node.
func spinCompliantNodes(trxPool []int,nodeId int) []int{
	var trx_map = make(map[int][]int)
	//var trx_map_consensus = make(map[int][]int)
	var trxArray_consensus []int
	trxArray := getInitialTrxArray(trxPool)
	followees := setFollowees(nodeId)

	//fmt.Println(nodeId,": ",followees)
	fmt.Println("C: ",nodeId,)

	for i := 0; i < numRounds; i++ {
		//fmt.Println(nodeId," C: ",i)
		trxArray1 := trxArray
		setTrx(trx_map,trxArray1, nodeId)
		//trxArray = getTrx(trxArray,followees,nodeId)
		trxArray  = checkMaliciousandGet(trxArray,followees,nodeId,trxPool)
		trxArray_consensus = append(trxArray_consensus,trxArray...)

	}

	setTrx_consensus(trx_map ,trxArray_consensus,nodeId)

    wg.Done()
	return trxArray_consensus


	}


//Spin and process a Malicious node.
func spinMaliciousNodes(trxPool []int,nodeId int)[]int {
	var trx_map = make(map[int][]int)
	var trxArray_consensus []int
	trxArray := getInitialTrxArray(trxPool)
	followees := setFollowees(nodeId)

	//fmt.Println(nodeId,": ",followees)
	fmt.Println("M: ",nodeId,)

	for i := 0; i < numRounds; i++ {
		//Send a malicious transaction,not part of the valid pool.
		//Probability is set by p_txDistribution and the number transaction set in the function.
		trxPool := genTrxPool(1)
		trxArray := append(trxArray,trxPool...)
		setTrx(trx_map,trxArray, nodeId)
		//trxArray = getTrx(trxArray,followees,nodeId)
		trxArray  = checkMaliciousandGet(trxArray,followees,nodeId,trxPool)
		//fmt.Println("len2:",nodeId,len(trxArray))
		trxArray_consensus = append(trxArray_consensus,trxArray...)


	}
	setTrx_consensus(trx_map ,trxArray_consensus,nodeId)
    wg.Done()
	return trxArray_consensus
}


func main() {

	trxPool := genTrxPool(500)
	// Determine the compliant and malisious nodes
	for i := 0; i < numNodes; i ++ {

		if rand.Float64() < p_malicious {
			wg.Add(1)

			go spinMaliciousNodes(trxPool, i)

		} else
		{
			wg.Add(1)

			go spinCompliantNodes(trxPool, i)


		}
	}

	wg.Wait()
    //Close Channels
	close(transactions_consensus)
	close(transactions)
    //Get the final set of transactions that each node beleives consensus on to a channel
	for e:= range transactions{
			print(e)

	}
}
