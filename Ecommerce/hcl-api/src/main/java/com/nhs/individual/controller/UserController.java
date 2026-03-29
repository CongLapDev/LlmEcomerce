package com.nhs.individual.controller;

import com.nhs.individual.constant.AccountProvider;
import com.nhs.individual.constant.AccountRole;
import com.nhs.individual.domain.User;
import com.nhs.individual.dto.AccountDto;
import com.nhs.individual.exception.ResourceNotFoundException;
import com.nhs.individual.secure.CurrentUser;
import com.nhs.individual.secure.IUserDetail;
import com.nhs.individual.service.CloudinaryService;
import com.nhs.individual.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/user")
@Validated
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private CloudinaryService cloudinaryService;
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public User findById(@PathVariable(value = "id") Integer id) {
        return userService.findById(id).map(user->{
            user.setAccount(new AccountDto(user.getAccount()));
            return user;
        }).orElseThrow(()-> new ResourceNotFoundException("User with id " + id + " not found"));
    }
    @RequestMapping(value = "/{id}",method=RequestMethod.DELETE)
    @PreAuthorize("hasAuthority('ADMIN')")
    public void delete(@PathVariable(value = "id") Integer id) {
        userService.deleteById(id);
    }
    @RequestMapping(value = "/{id}",method=RequestMethod.PUT)
    @PreAuthorize("#id==authentication.principal.userId or hasAuthority('ROLE_ADMIN')")
    public User update(@PathVariable(value = "id") Integer id, @Valid @RequestBody User user) {
        user.setId(id);
        return userService.update(user);
    }

    @RequestMapping(value = "/{id}/avatar", method = RequestMethod.POST)
    @PreAuthorize("#id==authentication.principal.userId or hasAuthority('ROLE_ADMIN')")
    public org.springframework.http.ResponseEntity<?> uploadAvatar(
            @PathVariable(value = "id") Integer id, 
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            // 1. Validate File Size
            if (file.getSize() > 2 * 1024 * 1024) {
                return org.springframework.http.ResponseEntity.badRequest().body(Map.of("message", "File size exceeds 2MB limit"));
            }
            // 2. Validate Content Type
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
                return org.springframework.http.ResponseEntity.badRequest().body(Map.of("message", "Only JPEG or PNG images are allowed"));
            }
            
            // 3. Upload to Cloudinary
            System.out.println("[UserController] Uploading avatar to Cloudinary for user ID: " + id);
            String imageUrl = cloudinaryService.upload(file, "avatars");
            
            if (imageUrl == null) {
                return org.springframework.http.ResponseEntity.internalServerError().body(Map.of("message", "Failed to upload avatar to Cloudinary"));
            }
            
            // 4. Update DB (Cloudinary secure URL)
            userService.updatePicture(id, imageUrl);
            System.out.println("[UserController] ✓ Avatar updated successfully for user ID " + id + ": " + imageUrl);
            
            // 5. Return Full URL
            return org.springframework.http.ResponseEntity.ok(Map.of("avatarUrl", imageUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.internalServerError().body(Map.of("message", "Failed to upload avatar: " + e.getMessage()));
        }
    }

    @RequestMapping(method = RequestMethod.GET)
    @Secured("ADMIN")
    public Page<User> findAllUser(@CurrentUser IUserDetail userDea, @RequestParam Map<String, String> propertiesMap){
        int page= 0;
        int size=10;
        AccountRole role=null;
        AccountProvider provider=null;
        propertiesMap.remove("size");
        try{
            if(propertiesMap.get("page")!=null) page=Integer.parseInt(propertiesMap.get("page"));
            if(propertiesMap.get("size")!=null) size=Integer.parseInt(propertiesMap.get("size"));
            if(propertiesMap.get("role")!=null) role=AccountRole.valueOf(propertiesMap.get("role"));
            if(propertiesMap.get("provider")!=null) provider=AccountProvider.valueOf(propertiesMap.get("provider"));
        }catch (NumberFormatException ignored){
            throw new IllegalArgumentException("Invalid type argument");
        }finally {
            propertiesMap.remove("page");
            propertiesMap.remove("size");
            propertiesMap.remove("role");
            propertiesMap.remove("provider");
        }
        String name=propertiesMap.get("name");propertiesMap.remove("name");
        String address=propertiesMap.get("address");propertiesMap.remove("address");
        return userService.findAll(page,size,name,address,role,provider,propertiesMap);
    }

}
