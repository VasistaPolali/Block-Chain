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










