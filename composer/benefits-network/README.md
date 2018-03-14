# org.example.biznet

Benfits-Network is a block chaim implementation using the Hyperledger Composer.

Hyperledger Composer is an application development framework which simplifies and expedites the creation of Hyperledger fabric blockchain applications.
For moreinformation.Refer to below links.

https://hyperledger-fabric.readthedocs.io/en/latest/

https://hyperledger.github.io/composer/introduction/introduction

Benefits-Network is a private  Block Chain Network.It helps the Organisations at the Federal and State level to seamlessly provide benefits to eligible memebers,and also process claims from the 3rd party providers.All this is achieved by the use of  Smart Contarcts and maintaining the transactions in a Distribute Ledger.

Lets go through a basic implementation.

First, let's create a beneficiary to claim the benefits called a member.


{
  "$class": "org.example.biznet.Member",
  "Id": "member1",
  "memberType": "beneficiary",
  "benefitEligibilityType": "health",
  "name": "testname1",
  "location": "la"
}

Create an Agency at the reginal level to handle benefit requets from local memebers.

{
  "$class": "org.example.biznet.Agency",
  "Id": "regionalAgency1",
  "agencyType": "nodal",
  "name": "Health Benefit Agency",
  "location": "la"
}

Create a 3rd party agency at the regional level to provide  benefit requets from local memebers.

{
  "$class": "org.example.biznet.Agency",
  "Id": "serviceProvider1",
  "agencyType": "provider",
  "name": "health provider",
  "location": "la"
}

Create a Federal  agency that processe the claims from the providers.
{
  "$class": "org.example.biznet.Agency",
  "Id": "federalAgency1",
  "agencyType": "federal",
  "name": "federal agency",
  "location": "washington D.C"
}

Let's create an asset called Benfefit.

{
  "$class": "org.example.biznet.Benefit",
  "benefitType": "health",
  "benefitId": "benefit1",
  "description": "Qaurterly Health Checkup Benefit"
}

Add asset Transaction on the Block Chain.

{
 "$class": "org.hyperledger.composer.system.AddAsset",
 "resources": [
  {
   "$class": "org.example.biznet.Benefit",
   "benefitType": "health",
   "benefitId": "benefit1",
   "description": "Qaurterly Health Checkup Benefit"
  }
 ],
 "targetRegistry": "resource:org.hyperledger.composer.system.AssetRegistry#org.example.biznet.Benefit",
 "transactionId": "88ae690fd95abdafa231fbc0e2e2c4b1a29acbd9ba3890a4a61b52477ced21a2",
 "timestamp": "2018-03-10T23:05:59.189Z"
}



Now the beneficiary creates an asset called Benefit Status to request benefit.

{
  "$class": "org.example.biznet.BenefitStatus",
  "status": "requested",
  "statusid": "benefitStatus1",
  "description": "Benefit Requested ",
  "benefit": "resource:org.example.biznet.Benefit#benefit1",
  "member": "resource:org.example.biznet.Member#member1",
  "agency": "resource:org.example.biznet.Agency#regionalAgency1"
}

Assets are updated across the network using Tranactions.
Once the Benfit is raised, the Reginal Agency in this case the Healt Department is notified.
The Reginal Agency initiates a transaction on the benefit request and changes the status to "OPEN" and assigns a service provider.
The network validates for the following before adding the transaction to the Block Chain.
1.)The benefit Status should not be in a CLOSED state.
2.)Verify the Member exists in the network.
3.)Member is eligible for this benefit.
4.)Benefit type is valid.
5.)The member is contacting the right Nodal Agency for his region.

{
  "$class": "org.example.biznet.RequestBenefit",
  "status": "OPEN",
  "statusUpdatedBy": "regionalAgency1",
  "provider": "serviceProvider1",
  "description": "Benefit approved.Please contact the listed Service provider for filling your request",
  "benefitStatus": "resource:org.example.biznet.BenefitStatus#benefitStatus1",
  "agency": "resource:org.example.biznet.Agency#regionalAgency1",
  "member": "resource:org.example.biznet.Member#member1"
}

Update Asset Transaction.

{
 "$class": "org.example.biznet.RequestBenefit",
 "status": "OPEN",
 "statusUpdatedBy": "regionalAgency1",
 "provider": "serviceProvider1",
 "description": "Benefit approved.Please contact the listed Service provider for filling your request",
 "benefitStatus": "resource:org.example.biznet.BenefitStatus#benefitStatus1",
 "agency": "resource:org.example.biznet.Agency#regionalAgency1",
 "member": "resource:org.example.biznet.Member#member1",
 "transactionId": "f6e164ffd01e006b796aeb9cd7b0987b8ded0f17a5533b538455eff1f24c7ec6",
 "timestamp": "2018-03-11T23:27:08.406Z"
}

Once the Service has been provided an other asset called EndorseAsset is created to individual endorse the contract between the member and the provider.

{
  "$class": "org.example.biznet.EndorseAsset",
  "Id": "endoeseAsset10",
  "status": "ENDORSED",
  "EndorsedBy": "member1",
  "description": "Services for requested Benefit received",
  "benefitStatusId": "benefitStatus1"
}

{
  "$class": "org.example.biznet.EndorseAsset",
  "Id": "endoeseAsset11",
  "status": "ENDORSED",
  "EndorsedBy": "serviceProvider1",
  "description": "Services provided for the requested Benefit",
  "benefitStatusId": "benefitStatus1"
}



Now, the Provider attempts to initiate a Transaction to change the status to CLOSE.
The network validates all the above and the following additionally before adding the transaction to the Block Chain.
1.)The benefit status has to be successfully endorsed by both the Member and the Provider.

{
  "$class": "org.example.biznet.RequestBenefit",
  "status": "CLOSE",
  "statusUpdatedBy": "serviceProvider1",
  "provider": "serviceProvider1",
  "description": "Services provided for the requested Benefit",
  "benefitStatus": "resource:org.example.biznet.BenefitStatus#benefitStatus1",
  "agency": "resource:org.example.biznet.Agency#regionalAgency1",
  "member": "resource:org.example.biznet.Member#member1"
}

Once the Benefit Status is CLOSE.The Provider would raise a claim with the Federal Agency for payment of a pre-determined amount.


{
  "$class": "org.example.biznet.Claim",
  "benefitStatus": "resource:org.example.biznet.BenefitStatus#benefitStatus1",
  "benefeciary": "resource:org.example.biznet.Member#member1",
  "nodalagency": "resource:org.example.biznet.Agency#regionalAgency1",
  "claimant": "resource:org.example.biznet.Agency#serviceProvider1",
  "federalAgency": "resource:org.example.biznet.Agency#federalAgency1",
  "claimId": "claimNumber1",
  "description": "Claim Processed",
  "status": "OPEN"
}

and intiates a Process claim transaction as below.

The network validates for the following before adding the transaction to the Block Chain.
1.)The Claim should not be in CLOSED status.
2.)The Claim shuld be raised and existing in the network.
3.)The Benefit Status asset exists in the network.
4.)The Benefit Status is in CLOSE state

{
  "$class": "org.example.biznet.ProcessClaim",
  "claim": "resource:org.example.biznet.Claim#claimNumber1"
}

The Smart Contract will be executed and Claim processed automatically.

{
 "$class": "org.example.biznet.ProcessClaim",
 "claim": "resource:org.example.biznet.Claim#claimNumber1",
 "transactionId": "b407d4bcc619d832b1e89ce5f7630d62302ff2799f2ddf5fc42ac68b2af4a616",
 "timestamp": "2018-03-13T19:28:39.250Z"
}













