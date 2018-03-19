'use strict';

function updateBenefitStatusRegistry(benefitTransac){
    var ben = benefitTransac.benefitStatus;
    ben.status = benefitTransac.status;
    ben.provider = benefitTransac.provider;
    ben.description = benefitTransac.description;
    ben.statusUpdatedBy = benefitTransac.statusUpdatedBy;
    return getAssetRegistry('org.example.biznet.BenefitStatus')
    .then(function(benefitStatusRegistry) {
        return benefitStatusRegistry.update(ben)
            var factory = getFactory();
            var benefitStatusEvent = factory.newEvent('org.example.biznet', 'eventMessage');
            benefitStatusEvent.message = "Benefit Status " + ben.Id + " updated"
            emit(benefitStatusEvent);
        
})
}

function checkEndorsementsandUpdate(ben,mem,agen,benefitTransac){   
   //Verify if asset has been endorsed
   var endorseArr = new Array()
   return getAssetRegistry('org.example.biznet.EndorseAsset')
   .then(function(endorseAssetRegistry){                   
       return endorseAssetRegistry.getAll();
   }).then(function(endorseAssets){
       endorseAssets.forEach(function(endorse){
           var check_bs_id = endorse.benefitStatusId == ben.Id && endorse.status=='ENDORSED'
           if(check_bs_id == true &&  endorse.EndorsedBy == agen.Id)

               {
                   endorseArr.push(endorse.EndorsedBy)
                      
               }
           else if(check_bs_id == true &&  endorse.EndorsedBy == mem.Id){ 

                   endorseArr.push(endorse.EndorsedBy)
               }
           });   
           //If endorsed by both member and agency                
           if(endorseArr.includes(mem.Id) && endorseArr.includes(agen.Id)){
               //update 
               updateBenefitStatusRegistry(benefitTransac)
           }

           else if(endorseArr.length > 0){
               throw new Error('Only ' + endorseArr + ' has endorsed.Cannot close');
       }
       else{
           throw new Error('This transaction failed.No member endorsed this asset.Cannot close'); 
       }       
})
            }

/**
 * Assign and Change Benefit Status
 * @param {org.example.biznet.RequestBenefit} benefitTransac - the benefit
 * @transaction
 */
function updateBenefitStatus(benefitTransac) {
    //Vefify if the benefitStatus is open 
    if(benefitTransac.benefitStatus.status != "CLOSE"){
  return getParticipantRegistry('org.example.biznet.Member')
    .then(function(participantRegistry) {
        //Verify if memeber exists
        return participantRegistry.exists(benefitTransac.member.getIdentifier()); 
    })
    .then(function(exists){
        if(!exists){    
            throw new Error('this transaction failed, member not registered.');
        }
        else{
        //Verify if benefit exists     
        return getAssetRegistry('org.example.biznet.Benefit')
        .then(function(benefitRegistry) {
            return benefitRegistry.exists(benefitTransac.benefitStatus.benefit.getIdentifier())
    }).then(function(exists){
        if(!exists){    
            throw new Error('this transaction failed,benefit type not found.');
        }
        else{  
            //Process the benefitStatus Transaction 
        var ben = benefitTransac.benefitStatus;
        var mem = benefitTransac.member;
        var agen = benefitTransac.agency;
        //Verify if locations are same 
        if(benefitTransac.agency.location == mem.location){
        if(ben.benefit.benefitType== mem.benefitEligibilityType){
            ben.status = benefitTransac.status;
            if(ben.status == "CLOSE"){
                //Verify if asset has been endorsed
                return checkEndorsementsandUpdate(ben,mem,agen,benefitTransac)
            }
             else {
                 //Update asset
                 updateBenefitStatusRegistry(benefitTransac)
    }
    }
    else {throw new Error('this transaction failed, beneficiary not eligible ');}
}
else {ben.description = "You are trying to contact the  wrong nodal agency.Please contact the agency for your geo area."
    return getAssetRegistry('org.example.biznet.BenefitStatus')
.then(function(benefitStatusRegistry) {
    return benefitStatusRegistry.update(ben)
})
}

}
    }); 
}  

});
}
else {throw new Error('this transaction failed, benefit Status is closed cannot change status.Contact Nodal Agency ');}
}

/**
 * Process claim
 * @param {org.example.biznet.ProcessClaim} processClaim - the claim
 * @transaction
 */

function processClaimRequest(processClaim) {
    //Verify if claim is already closed
    if(processClaim.status == "CLOSE"){
  return getAssetRegistry('org.example.biznet.Claim')
  
    .then(function(claimRegistry) {
        //Verify if claim exists
        return claimRegistry.exists(processClaim.claim.getIdentifier()); 
    }).then(function(exists){
        if(!exists){    
            throw new Error('this transaction failed, Calim details non existent .Raise Claim first.');
        }
        else {
            //Verify if BenefitStatus exists
            return getAssetRegistry('org.example.biznet.BenefitStatus')
    .then(function(benefitStatusRegistry) {
        return benefitStatusRegistry.exists(processClaim.claim.benefitStatus.getIdentifier());})
        .then(function(exists){
            if(!exists){   
                throw new Error('this transaction failed, BenefitStatus non existent .Contact Nodal Agency.');
            }
            //Verify if Benefit Status is in closed status. 
            else if(processClaim.claim.benefitStatus.status != "CLOSE") {
                throw new Error('this transaction failed, BenefitStatus not in  closed status .Contact Provider.');
            }
            else {
                //Update claim
                return getAssetRegistry('org.example.biznet.Claim') 
                .then(function(claimRegistry) {
                    var pro = processClaim.claim           
                    pro.status = "CLOSED"
                    pro.description = "Claim Processed"
                    return claimRegistry.update(pro)
                    var factory = getFactory();
                
                    var benefitStatusEvent = factory.newEvent('org.example.biznet', 'eventMessage');
                    benefitStatusEvent.message = "Claim " + pro.Id + " updated"
                    emit(benefitStatusEvent);
                 })
        }
  
})
}  
})
}

else {throw new Error('this transaction failed, claim Status is closed cannot process Claim.Contact '
  + processClaim.claim.federalAgency);}
}
