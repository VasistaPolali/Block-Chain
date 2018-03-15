
# A Private Block Chain Network with Hyperledger Composer.

Benfits-Network is a demonstration of a block chain implementation using the Hyperledger Composer.It is a template and can be adapted to other similar use cases for a Multi-Party Private Blockchain network.

Hyperledger Composer is an application development framework which simplifies and expedites the creation of Hyperledger Fabric block chain applications.

For more information.Refer to below links.

https://hyperledger-fabric.readthedocs.io/en/latest/

https://hyperledger.github.io/composer/introduction/introduction

To set up Development Environmnet follw the link.Import the benefits-netowrk.bna and test it.
Once the business network is tested and in place, front-end applications can be created. Use the REST Server to automatically generate a REST API for a business network, and a skeleton generate Angular application using the Yeoman code generator.

https://hyperledger.github.io/composer/installing/development-tools.html


The use case of Benefits-Network is to help organisations at the Federal and State level to seamlessly provide benefits to eligible members,and also process claims from 3rd party service providers.All this is achieved by the use of  Smart Contarcts and maintaining the transactions in a Distributed Ledger.

Let's go through a basic implementation.
Entities are created using the Composer Modeling Language.
```
models/org.example.biznet.cto
```
A Buiness Network typically includes:
Assets - To be traded in the business network.
Participants - Members of the network in various capacities.
Transactions - Update the Ledger with changes to assets and participants.
Events- Emits Notifications on occurence of an event.

Transaction logic is written in Java Script.
```
lib/logic.js
```
First, let's create a beneficiary to claim the benefits called a member.

```
{
  "$class": "org.example.biznet.Member",
  "Id": "member1",
  "memberType": "beneficiary",
  "benefitEligibilityType": "health",
  "name": "testname1",
  "location": "los angeles"
}
```
Create an Agency at the regional level to handle benefit requets from local members.
```
{
  "$class": "org.example.biznet.Agency",
  "Id": "regionalAgency1",
  "agencyType": "nodal",
  "name": "Health Benefit Agency",
  "location": "los angeles"
}
```
Create a 3rd party agency at the regional level to provide services to the beneficiaries.
```
{
  "$class": "org.example.biznet.Agency",
  "Id": "serviceProvider1",
  "agencyType": "provider",
  "name": "health provider",
  "location": "la"
}
```
Create a Federal  agency that processes the claims and pays the providers.
```
{
  "$class": "org.example.biznet.Agency",
  "Id": "federalAgency1",
  "agencyType": "federal",
  "name": "federal agency",
  "location": "washington D.C"
}
```
Let's create an asset called Benefit.
```
{
  "$class": "org.example.biznet.Benefit",
  "benefitType": "health",
  "benefitId": "benefit1",
  "description": "Qaurterly Health Checkup Benefit"
}
```
Add asset transaction in the Block Chain.
```
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
```
Now the beneficiary creates an asset called Benefit Status to request benefit.
```
{
  "$class": "org.example.biznet.BenefitStatus",
  "status": "requested",
  "statusid": "benefitStatus1",
  "description": "Benefit Requested ",
  "benefit": "resource:org.example.biznet.Benefit#benefit1",
  "member": "resource:org.example.biznet.Member#member1",
  "agency": "resource:org.example.biznet.Agency#regionalAgency1"
}
```
Assets are updated across the network using Tranactions.
Once the Benfit request is raised, the Regional Agency in this case the Healt Department is notified.
The Regional Agency initiates a transaction on the benefit request and changes the status to "OPEN" and assigns a service provider.
The network validates for the following before adding the transaction to the Block Chain.
1.)The benefit status is not in CLOSE state.
2.)Verify the Member exists in the network.
3.)Member is eligible for this benefit.
4.)Benefit type is valid.
5.)The member is contacting the right Nodal Agency for his region.
```
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
```
Update Asset Transaction.
```
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
```
Once the Service has been provided an other asset called EndorseAsset is created to individually endorse the contract between the member and the provider.
```
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

```

Now, the Provider attempts to initiate a Transaction to change the status to CLOSE.
The network validates all the above and the following additionally before adding the transaction to the Block Chain.
1.)The benefit status has to be successfully endorsed by both the Member and the Provider.
```
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
```
Once the Benefit Status is CLOSE.The Provider would raise a claim with the Federal Agency for payment of a pre-determined amount.

```
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
```
and intiates a Process claim transaction as below.

The network validates for the following before adding the transaction to the Block Chain.
1.)The Claim should not be in CLOSED status.
2.)The Claim should be raised and existing in the network.
3.)The Benefit Status asset exists in the network.
4.)The Benefit Status is in CLOSE state
```
{
  "$class": "org.example.biznet.ProcessClaim",
  "claim": "resource:org.example.biznet.Claim#claimNumber1"
}
```
The Smart Contract will be executed and Claim processed automatically.
```
{
 "$class": "org.example.biznet.ProcessClaim",
 "claim": "resource:org.example.biznet.Claim#claimNumber1",
 "transactionId": "b407d4bcc619d832b1e89ce5f7630d62302ff2799f2ddf5fc42ac68b2af4a616",
 "timestamp": "2018-03-13T19:28:39.250Z"
}
```


