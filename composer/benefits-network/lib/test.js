'use strict';


/**
 * Assign and Change Benefit Status
 * @param {org.example.biznet.RequestBenefit} benefitTransac - the benefit
 * @transaction
 */
function updateBenefitStatus(benefitTransac) {
    //main
    if(benefitTransac.benefitStatus.status != "CLOSE"){
  return getParticipantRegistry('org.example.biznet.Member')
    .then(function(participantRegistry) {
        //Verify if owner exists (derive from relationship field passed in)
        return participantRegistry.exists(benefitTransac.member.getIdentifier()); 
    })
    //1
    .then(function(exists){
        if(!exists){
            //1     
            throw new Error('this transaction failed, member not registered.');
        }
        else{
        //Verify if benefit exists     
        return getAssetRegistry('org.example.biznet.Benefit')
        .then(function(benefitRegistry) {
            //
            return benefitRegistry.exists(benefitTransac.benefitStatus.benefit.getIdentifier())
            //2
    }).then(function(exists){
        if(!exists){
            //1     
            throw new Error('this transaction failed,benefit type not found.');
        }
        else{   
        var ben = benefitTransac.benefitStatus;
        var mem = benefitTransac.member;
        var agen = benefitTransac.agency;
        //check for elegibility
        //1f
        if(benefitTransac.agency.location == mem.location){
          //console.log("*******################")
          //console.log(benefitTransac.agency.location)
          //console.log(mem.location)
          //2f
        if(ben.benefit.benefitType== mem.benefitEligibilityType){
            //console.log("*******################")
            //console.log(benefitTransac.status)
            ben.status = benefitTransac.status;
            //3f
            if(ben.status == "CLOSE"){
                var endorseArr = new Array()
                //**To do provide more provider details.
                //**Todo quota system */
                //Check for endorsements
                return getAssetRegistry('org.example.biznet.EndorseAsset')
                .then(function(endorseAssetRegistry){
                    
                    return endorseAssetRegistry.getAll();
                  //3
                }).then(function(endorseAssets){
                    endorseAssets.forEach(function(endorse){
                                           
                        console.log("*******################")
                        console.log(endorse.benefitStatusId)
                        console.log(endorse.EndorsedBy)
                        console.log(endorse.status)
                        console.log(ben.Id)
                        console.log(agen.Id)
                        console.log(mem.Id)

                        //4f
                        var check_bs_id = endorse.benefitStatusId == ben.Id && endorse.status=='ENDORSED'

                        console.log(check_bs_id)

                        if(check_bs_id == true &&  endorse.EndorsedBy == agen.Id)

                            {
                                console.log("*******################")
                                endorseArr.push(endorse.EndorsedBy)
                                   
                            }
                        else if(check_bs_id == true &&  endorse.EndorsedBy == mem.Id){ 

                                console.log("*******################")
                                endorseArr.push(endorse.EndorsedBy)
                            }
                        });
                    
                                console.log("*******################")
                                console.log(endorseArr)
                          
                                //5f
                        if(endorseArr.includes(mem.Id) && endorseArr.includes(agen.Id)){
                            ben.provider = benefitTransac.provider;
                            ben.description = benefitTransac.description;
                            ben.statusUpdatedBy = benefitTransac.statusUpdatedBy;
                            return getAssetRegistry('org.example.biznet.BenefitStatus')
                            .then(function(benefitStatusRegistry) {
                            return benefitStatusRegistry.update(ben)
                            })
                         //5f   
                        }
    
                        else if(endorseArr.length > 0){
                            throw new Error('Only ' + endorseArr + ' has endorsed.Cannot close');
                    }
                    else{
                        throw new Error('This transaction failed.No member endorsed this asset.Cannot close'); 
                    }
                    
                    //3
                //3f            
            })
            }
             else {
        //3
            ben.provider = benefitTransac.provider;
            ben.description = benefitTransac.description;
            ben.statusUpdatedBy = benefitTransac.statusUpdatedBy;
            return getAssetRegistry('org.example.biznet.BenefitStatus')
            .then(function(benefitStatusRegistry) {
                return benefitStatusRegistry.update(ben)
        })
    }
        //2f
    }
    //2f
    else {throw new Error('this transaction failed, beneficiary not eligible ');}
}
//1f
else {ben.description = "You are trying to contact the  wrong nodal agency.Please contact the agency for your geo area."
    return getAssetRegistry('org.example.biznet.BenefitStatus')
.then(function(benefitStatusRegistry) {
    return benefitStatusRegistry.update(ben)
})
}

}
//2
    }); 
}  

});
}
//main
else {throw new Error('this transaction failed, benefit Status is closed cannot change status.Contact Nodal Agency ');}
}


/**
 * Assign and Change Benefit Status
 * @param {org.example.biznet.ProcessClaim} processClaim - the claim
 * @transaction
 */

function updateBenefitStatus(processClaim) {
    //main
    if(processClaim.status !== "CLOSE"){
  return getAssetRegistry('org.example.biznet.Claim')
  
    .then(function(claimRegistry) {
        //Verify if owner exists (derive from relationship field passed in)
        return claimRegistry.exists(processClaim.claim.getIdentifier()); 
        //1
    }).then(function(exists){
        if(!exists){
            //1     
            throw new Error('this transaction failed, Calim details non existent .Raise Claim first.');
        }
  //2
        else {
            return getAssetRegistry('org.example.biznet.BenefitStatus')
    .then(function(benefitStatusRegistry) {
        return benefitStatusRegistry.exists(processClaim.claim.benefitStatus.getIdentifier());})
        //3
        .then(function(exists){
            if(!exists){
                //1     
                throw new Error('this transaction failed, BenefitStatus non existent .Contact Nodal Agency.');
            }
            else if(processClaim.claim.benefitStatus.status != "CLOSE") {
                throw new Error('this transaction failed, BenefitStatus not in  closed status .Contact Provider.');
                


            }
            //4
            else {
                console.log("*******################")
                console.log(processClaim.claim.status)
                return getAssetRegistry('org.example.biznet.Claim')
  
                .then(function(claimRegistry) {
                    var pro = processClaim.claim
                
                    pro.status = "CLOSED"
                    pro.description = "Claim Processed"
                    return claimRegistry.update(pro) })
                
      //4
        }
 //3   
})

//2
}
 //1   

})

//main
}

else {throw new Error('this transaction failed, claim Status is closed cannot process Claim.Contact '
  + processClaim.claim.federalAgency);}
}